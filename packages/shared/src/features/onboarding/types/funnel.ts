import type { ComponentProps } from 'react';
import type {
  BoxFaqProps,
  BoxListProps,
  ImageReviewProps,
  PricingPlanVariation,
  Review,
  StepHeadlineAlign,
} from '../shared';
import type { FormInputCheckboxGroupProps } from '../../common/components/FormInputCheckboxGroup';
import type { ThemeMode } from '../../../contexts/SettingsContext';

export enum FunnelStepType {
  LandingPage = 'landingPage',
  Fact = 'fact',
  Quiz = 'quiz',
  Signup = 'registration',
  Pricing = 'pricing',
  Checkout = 'checkout',
  PaymentSuccessful = 'paymentSuccessful',
  TagSelection = 'tagsSelection',
  ReadingReminder = 'readingReminder',
  AppPromotion = 'appPromotion',
  SocialProof = 'socialProof',
  Loading = 'loading',
  ProfileForm = 'profileForm',
  EditTags = 'editTags',
  ContentTypes = 'contentTypes',
  InstallPwa = 'installPwa',
}

export enum FunnelBackgroundVariant {
  Blank = 'blank',
  Default = 'default',
  Light = 'light',
  Bottom = 'bottom',
  Top = 'top',
  CircleTop = 'circleTop',
  CircleBottom = 'circleBottom',
  Hourglass = 'hourglass',
}

export enum FunnelStepTransitionType {
  Skip = 'skip',
  Complete = 'complete',
}

export const COMPLETED_STEP_ID = 'finish' as const;

export type FunnelStepTransitionCallback<Details = Record<string, unknown>> =
  (transition: { type: FunnelStepTransitionType; details?: Details }) => void;

export interface FunnelBannerMessageParameters {
  image: {
    src: string;
  };
  content: string;
  stepsToDisplay: string[];
}

export interface FunnelStepCommonParameters {
  backgroundType?: FunnelBackgroundVariant;
  cta?: string;
  reverse?: boolean;
}

type FunnelStepParameters<Params = Record<string, unknown>> = {
  [key in keyof Params]: Params[key];
} & FunnelStepCommonParameters & {
    [p: string]: unknown;
  };

export type FunnelStepTransition = {
  on: FunnelStepTransitionType;
  destination: FunnelStep['id'] | typeof COMPLETED_STEP_ID;
};

interface FunnelStepCommon<T = FunnelStepParameters> {
  id: string;
  parameters: FunnelStepParameters<T>;
  transitions: FunnelStepTransition[];
  isActive?: boolean;
}

export interface FunnelChapter {
  id: string;
  steps: Array<FunnelStep>;
}

export interface FunnelStepLandingPage extends FunnelStepCommon {
  type: FunnelStepType.LandingPage;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepLoading
  extends FunnelStepCommon<{
    headline: string;
    explainer: string;
  }> {
  type: FunnelStepType.Loading;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepFactParameters {
  headline: string;
  cta?: string;
  reverse?: boolean;
  explainer: string;
  align: StepHeadlineAlign;
  visualUrl?: string;
  layout?: 'default' | 'reversed' | 'centered';
}

export interface FunnelStepFact
  extends FunnelStepCommon<FunnelStepFactParameters> {
  type: FunnelStepType.Fact;
  onTransition: FunnelStepTransitionCallback;
}

export enum FunnelStepQuizQuestionType {
  Radio = 'singleChoice',
  Checkbox = 'multipleChoice',
  Rating = 'rating',
}

export type FunnelQuestionCommon = {
  text: string;
  placeholder?: string;
  options: Array<{
    label: string;
    value?: string;
    image?: ComponentProps<'img'>;
  }>;
  imageUrl?: string;
  optionStyle?: 'default' | 'simplified';
};

export type FunnelQuestionCheckbox = FunnelQuestionCommon &
  ({
    type:
      | FunnelStepQuizQuestionType.Checkbox
      | FunnelStepQuizQuestionType.Radio;
  } & Pick<FormInputCheckboxGroupProps, 'variant' | 'cols' | 'behaviour'>);

export type FunnelQuestionRating = FunnelQuestionCommon & {
  type: FunnelStepQuizQuestionType.Rating;
};

export type FunnelQuestion = FunnelQuestionCheckbox | FunnelQuestionRating;

export interface FunnelStepQuiz
  extends FunnelStepCommon<{
    question: FunnelQuestion;
    explainer?: string;
  }> {
  type: FunnelStepType.Quiz;
  onTransition: FunnelStepTransitionCallback<Record<string, string | string[]>>;
}

export interface FunnelStepSignup
  extends FunnelStepCommon<{
    headline: string;
    image: string;
    imageMobile: string;
  }> {
  type: FunnelStepType.Signup;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepPricingParameters {
  headline: string;
  cta: string;
  discount: {
    message: string;
    duration: number;
  };
  defaultPlan: string;
  plans: {
    priceId: string;
    label: string;
    variation?: PricingPlanVariation;
    badge: {
      text: string;
      background: string;
    };
  }[];
  perks: string[];
  featuresList: Omit<BoxListProps, 'className'>;
  review: Omit<ImageReviewProps, 'className'>;
  refund: {
    title: string;
    content: string;
    image: string;
  };
  faq: BoxFaqProps['items'];
}

export interface FunnelStepPricing
  extends FunnelStepCommon<FunnelStepPricingParameters> {
  type: FunnelStepType.Pricing;
  onTransition: FunnelStepTransitionCallback<{
    plan: string;
    applyDiscount: boolean;
  }>;
  discountStartDate: Date;
}

export interface FunnelStepCheckoutParameters {
  discountCode?: string;
}

export interface FunnelStepCheckout
  extends FunnelStepCommon<FunnelStepCheckoutParameters> {
  type: FunnelStepType.Checkout;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepTagSelection extends FunnelStepCommon {
  type: FunnelStepType.TagSelection;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepReadingReminder
  extends FunnelStepCommon<{ headline: string }> {
  type: FunnelStepType.ReadingReminder;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepAppPromotion extends FunnelStepCommon {
  type: FunnelStepType.AppPromotion;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepSocialProof
  extends FunnelStepCommon<{
    imageUrl: string;
    rating: string;
    reviews: Review[];
    reviewSubtitle: string;
    cta?: string;
  }> {
  type: FunnelStepType.SocialProof;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepPaymentSuccessful
  extends FunnelStepCommon<
    Partial<{
      headline: string;
      explainer: string;
      imageUrl: string;
    }>
  > {
  type: FunnelStepType.PaymentSuccessful;
  onTransition: FunnelStepTransitionCallback<void>;
}

export interface FunnelStepProfileForm
  extends FunnelStepCommon<{
    headline: string;
    image: string;
    imageMobile: string;
  }> {
  type: FunnelStepType.ProfileForm;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepEditTags
  extends FunnelStepCommon<{
    headline: string;
    minimumRequirement: number;
  }> {
  type: FunnelStepType.EditTags;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepContentTypes
  extends FunnelStepCommon<{ headline: string }> {
  type: FunnelStepType.ContentTypes;
  onTransition: FunnelStepTransitionCallback;
}

export interface FunnelStepInstallPwa
  extends FunnelStepCommon<{ headline: string }> {
  type: FunnelStepType.InstallPwa;
  onTransition: FunnelStepTransitionCallback;
}

export type FunnelStep =
  | FunnelStepLandingPage
  | FunnelStepFact
  | FunnelStepQuiz
  | FunnelStepSignup
  | FunnelStepPricing
  | FunnelStepCheckout
  | FunnelStepTagSelection
  | FunnelStepReadingReminder
  | FunnelStepAppPromotion
  | FunnelStepSocialProof
  | FunnelStepLoading
  | FunnelStepProfileForm
  | FunnelStepEditTags
  | FunnelStepContentTypes
  | FunnelStepInstallPwa;

export type FunnelPosition = {
  chapter: number;
  step: number;
};

interface FunnelParameters {
  cookieConsent: {
    show: boolean;
  };
  theme: {
    mode: ThemeMode;
  };
  banner: FunnelBannerMessageParameters;
}

export interface FunnelJSON {
  id: string;
  version: number;
  parameters: Partial<FunnelParameters>;
  entryPoint: FunnelStep['id'];
  chapters: Array<FunnelChapter>;
  redirectOnFinish?: string;
}

export const stepsWithHeader: Array<FunnelStepType> = [FunnelStepType.Quiz];
