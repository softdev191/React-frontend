import React from 'react';
import { Redirect } from 'react-router';

import useUser from '../lib/user/useUser';

function LoginCheck() {
  const [user] = useUser();
  if (user) {
    // put your default redirect here
    // if (user.roles && user.roles.find(r => r.name === 'Admin')) {
    //   return <Redirect to='/cms' />;
    // }
    return <Redirect to='/login' />;
  } else if (user === null) {
    return <Redirect to='/login' />;
  }
  return null;
}

export default LoginCheck;
