import React from 'react';
import { Switch } from 'react-router-dom';

import { ProtectedRoute } from '../../components';
import UserGuard from '../../lib/user/user.guard';
import BidDetails from './BidDetails';
import BidEstimates from './BidEstimates';
import BidExport from './BidExport';
import BidPlans from './BidPlans';
import BidList from './BidList';
import BidOverview from './BidOverview';
import BidPricing from './BidPricing';
import SubscriptionGuard from '../../lib/user/subscription.guard';
import { ProtectedRouteProps } from '../../components/ProtectedRoute';
import BidPreview from './BidPreview';

const SubscriptionProtectedRoute = (props: ProtectedRouteProps) => (
  <ProtectedRoute redirectTo='/denied' guards={[UserGuard, SubscriptionGuard]} {...props} />
);

function BidFlow() {
  return (
    <Switch>
      <SubscriptionProtectedRoute path={'/bids/:bid/overview'} title='Bid Overview'>
        <BidOverview />
      </SubscriptionProtectedRoute>
      <SubscriptionProtectedRoute path={'/bids/new/overview'} title='Bid Overview'>
        <BidOverview />
      </SubscriptionProtectedRoute>
      <SubscriptionProtectedRoute path={'/bids/:bid/plans'} title='Bid Plans'>
        <BidPlans />
      </SubscriptionProtectedRoute>
      <SubscriptionProtectedRoute path={'/bids/:bid/details'} title='Bid Details'>
        <BidDetails />
      </SubscriptionProtectedRoute>
      <SubscriptionProtectedRoute path={'/bids/:bid/estimates'} title='Bid Estimates'>
        <BidEstimates />
      </SubscriptionProtectedRoute>
      <SubscriptionProtectedRoute path={'/bids/:bid/pricing'} title='Bid Pricing'>
        <BidPricing />
      </SubscriptionProtectedRoute>

      <SubscriptionProtectedRoute path={'/bids/:bid/bid-preview'} title='Bid Preview'>
        <BidPreview />
      </SubscriptionProtectedRoute>

      <SubscriptionProtectedRoute path={'/bids/:bid/export'} title='Bid Export'>
        <BidExport />
      </SubscriptionProtectedRoute>

      {/* Default landing component */}
      <ProtectedRoute exact path={'/bids'} title='Bid List' guards={[UserGuard]}>
        <BidList />
      </ProtectedRoute>
    </Switch>
  );
}

export default BidFlow;
