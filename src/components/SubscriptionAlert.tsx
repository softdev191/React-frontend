import React from 'react';
import styled from 'styled-components';

import { Box, Text } from './';
import theme from '../constants/Theme';
import useSubscription from '../lib/user/useSubscription';
import { UserGetSubscriptionDTO } from '../lib/api/User.hooks';
import { SubscriptionStatus } from '../constants/Subscription';
import Link from './Link';
import { useLocation } from 'react-router-dom';

const Container = styled(Box)`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

export function SubscriptionAlert() {
  const { pathname } = useLocation();
  const [mySubscription] = useSubscription();
  const { subscription, trialEnded } = (mySubscription as UserGetSubscriptionDTO) || {};
  const { ACTIVE, EXPIRED, INACTIVE } = SubscriptionStatus;
  const isSubscriptionPage = pathname.endsWith('/subscription');

  if (!mySubscription || isSubscriptionPage || [ACTIVE].includes(subscription?.status)) {
    return null;
  } else {
    return (
      <Container bg={!trialEnded ? 'none' : theme.primary}>
        <Text color={trialEnded ? 'white' : theme.companyBlue}>
          {trialEnded
            ? subscription?.status === EXPIRED
              ? `Renew your subscription to access your bids. `
              : subscription?.status === INACTIVE
              ? `Check your subscription or complete payment to access your bids. `
              : ''
            : `You are on the free trial. `}
        </Text>
        &nbsp;
        {!isSubscriptionPage && (
          <Link href='/subscription' color={trialEnded ? 'white' : theme.companyBlue}>
            Manage subscription.
          </Link>
        )}
      </Container>
    );
  }
}

export default SubscriptionAlert;
