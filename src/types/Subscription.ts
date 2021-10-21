import { SubscriptionStatus, SubscriptionType } from '../constants/Subscription';

export interface CreateSubscriptionDto {
  type: SubscriptionType;
}

export type Subscription = {
  id?: number;
  type: SubscriptionType;
  status: SubscriptionStatus;
  expirationDate: Date;
  trialEndDate: Date;
  isTrial: boolean;
};
