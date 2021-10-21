import React from 'react';
import { Switch } from 'react-router-dom';
import { ProtectedRoute } from '../../components';
import UserGuard from '../../lib/user/user.guard';
import MySubscription from './MySubscription';

export function SubscriptionFlow() {
  return (
    <Switch>
      <ProtectedRoute path='/subscription' guards={[UserGuard]}>
        {/* default landing */}
        <MySubscription />
      </ProtectedRoute>
    </Switch>
  );
}
