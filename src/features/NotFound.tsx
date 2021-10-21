import React from 'react';
import { Layout, Text } from '../components';

function NotFound() {
  return (
    <Layout py={6}>
      <Text variant='sectionTitle'>Not Found</Text>
      <p>We could not find the page you are looking for.</p>
    </Layout>
  );
}

export default NotFound;
