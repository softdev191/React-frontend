import React from 'react';
import { Layout, Text } from '../../components';
import useUser from '../../lib/user/useUser';
import NotFound from '../NotFound';

function AccessDenied() {
  const [user] = useUser();

  return !user ? (
    <NotFound />
  ) : (
    <Layout py={6}>
      <Text variant='sectionTitle'>Subscription Required</Text>
      <p>Please check that your subscription plan is active.</p>
    </Layout>
  );
}

export default AccessDenied;
