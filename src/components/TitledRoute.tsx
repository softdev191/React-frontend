import React, { PropsWithChildren, useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';

export type TitledRouteProps = PropsWithChildren<RouteProps & { title?: string }>;
function TitledRoute(props: TitledRouteProps) {
  const { title = '', children, ...rest } = props;
  useEffect(() => {
    document.title = `BidVita ${title && '- ' + title}`;
  }, [title]);
  return <Route {...rest}>{children}</Route>;
}

export default TitledRoute;
