import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useQueryParam } from 'use-query-params';

import { ButtonWithRipple, Layout, LoadedContainer, Text } from '../../components';
import { useVerifyAccount } from '../../lib/api/User.hooks';
import useUser from '../../lib/user/useUser';

function VerifyAccount() {
  const history = useHistory();
  const [user] = useUser();
  const [tokenString] = useQueryParam<string>('token');

  const [isVerifying, setIsVerifying] = useState(true);
  const { doVerifyAccount, ...verifyAccount } = useVerifyAccount();

  useEffect(() => {
    if (user) {
      history.replace('/bids');
    } else if (tokenString) {
      doVerifyAccount(tokenString);
    } else {
      history.replace('/home');
    }
  }, [doVerifyAccount, tokenString, user, history]);

  useEffect(() => {
    if (verifyAccount.data !== null && !verifyAccount.error) {
      setIsVerifying(false);
    }
    if (verifyAccount.error) {
      history.replace('/home');
    }
  }, [verifyAccount.data, verifyAccount.error, history]);

  return (
    <Layout variant='centeredColumn'>
      <LoadedContainer isLoading={isVerifying} my={120} maxWidth={800} minWidth={320} width='55vw'>
        <Text variant='title' mb={98}>
          Account Verified
        </Text>
        <Text mb={60}>Your account has been verified. You can now sign in to your account.</Text>
        <Link to={'/signin'}>
          <ButtonWithRipple variant='primary' width='auto' padding='0 60px'>
            Proceed to Sign In
          </ButtonWithRipple>
        </Link>
      </LoadedContainer>
    </Layout>
  );
}

export default VerifyAccount;
