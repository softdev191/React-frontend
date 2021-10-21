import React from 'react';
import { RouteProps, Redirect } from 'react-router';
import useUser from '../lib/user/useUser';

import { GuardFunc } from '../types/types';
import TitledRoute, { TitledRouteProps } from './TitledRoute';

export type ProtectedRouteProps = RouteProps &
  TitledRouteProps & {
    guards?: Array<GuardFunc>;

    // Will use to redirect when all guards failed to activate
    // By default it will redirect to `/`
    redirectTo?: string;
  };

function ProtectedRoute(props: ProtectedRouteProps) {
  const [user] = useUser();

  const { pathname, search } = window.location;
  const next = props.path ? `?next=${encodeURIComponent(pathname + search)}` : '';

  const defaultRedirect = user ? '' : `/signin${next}`;

  const { guards = [], redirectTo = defaultRedirect } = props;
  const isAllowed = guards.every(guard => guard().canActivate());
  return !isAllowed ? <Redirect to={redirectTo} /> : <TitledRoute {...props} />;
}

export default ProtectedRoute;
