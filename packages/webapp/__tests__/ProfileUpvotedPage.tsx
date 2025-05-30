import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import type {
  LoggedUser,
  PublicProfile,
} from '@dailydotdev/shared/src/lib/user';
import nock from 'nock';
import type { FeedData } from '@dailydotdev/shared/src/graphql/feed';
import { USER_UPVOTED_FEED_QUERY } from '@dailydotdev/shared/src/graphql/feed';
import { QueryClient } from '@tanstack/react-query';
import type { MockedGraphQLResponse } from '@dailydotdev/shared/__tests__/helpers/graphql';
import { mockGraphQL } from '@dailydotdev/shared/__tests__/helpers/graphql';
import { waitForNock } from '@dailydotdev/shared/__tests__/helpers/utilities';
import { TestBootProvider } from '@dailydotdev/shared/__tests__/helpers/boot';
import defaultUser from '@dailydotdev/shared/__tests__/fixture/loggedUser';
import defaultFeedPage from '@dailydotdev/shared/__tests__/fixture/feed';
import { InteractiveFeedProvider } from '@dailydotdev/shared/src/contexts/InteractiveFeedContext';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import ProfilePage from '../pages/[userId]/upvoted';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  nock.cleanAll();
  jest.clearAllMocks();

  mocked(useRouter).mockImplementation(
    () =>
      ({
        pathname: '/',
        query: {},
        isFallback: false,
      } as unknown as NextRouter),
  );
});

const createFeedMock = (
  page = defaultFeedPage,
): MockedGraphQLResponse<FeedData> => ({
  request: {
    query: USER_UPVOTED_FEED_QUERY,
    variables: {
      userId: 'u2',
      first: 7,
      after: '',
      loggedIn: true,
    },
  },
  result: {
    data: {
      page,
    },
  },
});

const defaultProfile: PublicProfile = {
  id: 'u2',
  name: 'Daily Dev',
  username: 'dailydotdev',
  premium: false,
  reputation: 20,
  image: 'https://daily.dev/daily.png',
  cover: 'https://daily.dev/cover.png',
  bio: 'The best company!',
  createdAt: '2020-08-26T13:04:35.000Z',
  twitter: 'dailydotdev',
  github: 'dailydotdev',
  hashnode: 'dailydotdev',
  portfolio: 'https://daily.dev/?key=vaue',
  permalink: 'https://daily.dev/dailydotdev',
};

const renderComponent = (
  mocks: MockedGraphQLResponse[] = [createFeedMock()],
  profile: Partial<PublicProfile> = {},
  user: LoggedUser = defaultUser,
): RenderResult => {
  const client = new QueryClient();

  mocks.forEach(mockGraphQL);
  return render(
    <TestBootProvider client={client} auth={{ user }}>
      <InteractiveFeedProvider>
        <ProfilePage user={{ ...defaultProfile, ...profile }} />
      </InteractiveFeedProvider>
    </TestBootProvider>,
  );
};

it('should show the cards', async () => {
  renderComponent();
  await waitForNock();
  await Promise.all(
    defaultFeedPage.edges.map(async (edge) => {
      expect(await screen.findByText(edge.node.title)).toBeInTheDocument();
    }),
  );
});

it('should show empty screen when no posts', async () => {
  renderComponent([
    createFeedMock({
      pageInfo: {
        hasNextPage: true,
        endCursor: '',
      },
      edges: [],
    }),
  ]);
  await waitForNock();
  const el = await screen.findByText("Daily Dev hasn't upvoted yet");
  expect(el).toBeInTheDocument();
});

it('should show different empty screen when visiting your profile', async () => {
  renderComponent(
    [
      createFeedMock({
        pageInfo: {
          hasNextPage: true,
          endCursor: '',
        },
        edges: [],
      }),
    ],
    {},
    defaultProfile as unknown as LoggedUser,
  );
  await waitForNock();
  const el = await screen.findByText('Explore posts');
  expect(el).toBeInTheDocument();
});
