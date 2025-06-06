import { gql } from 'graphql-request';
import { SOURCE_SHORT_INFO_FRAGMENT, USER_AUTHOR_FRAGMENT } from './fragments';
import type { Post } from './posts';

export type FurtherReadingData = {
  trendingPosts: Post[];
  similarPosts: Post[];
  discussedPosts: Post[];
};

const FURTHER_READING_FRAGMENT = gql`
  fragment FurtherReading on Post {
    id
    title
    permalink
    commentsPermalink
    bookmarked @include(if: $loggedIn)
    image
    readTime
    numComments
    numUpvotes
    numAwards
    source {
      ...SourceShortInfo
    }
    scout {
      ...UserAuthor
    }
    author {
      ...UserAuthor
    }
  }
  ${SOURCE_SHORT_INFO_FRAGMENT}
  ${USER_AUTHOR_FRAGMENT}
`;

export const FURTHER_READING_QUERY = gql`
  query SimilarPosts(
    $post: ID!
    $loggedIn: Boolean! = false
    $trendingFirst: Int
    $similarFirst: Int
    $discussedFirst: Int
    $withDiscussedPosts: Boolean! = false
    $tags: [String]!
  ) {
    trendingPosts: randomTrendingPosts(post: $post, first: $trendingFirst) {
      ...FurtherReading
      bookmarked @include(if: $loggedIn)
      trending
      tags
    }
    similarPosts: randomSimilarPostsByTags(
      tags: $tags
      post: $post
      first: $similarFirst
    ) {
      ...FurtherReading
      bookmarked @include(if: $loggedIn)
      tags
    }
    discussedPosts: randomDiscussedPosts(post: $post, first: $discussedFirst)
      @include(if: $withDiscussedPosts) {
      ...FurtherReading
    }
  }
  ${FURTHER_READING_FRAGMENT}
`;
