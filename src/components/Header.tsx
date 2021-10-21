import React from 'react';

import theme from '../constants/Theme';
import styled from '../styled-components';
import useUser from '../lib/user/useUser';
import { NavRouteSections } from '../features/AppRouteSections';
import { Box, AppNavbar, MarketingNavbar, BidNavbar } from './';
import { BidNavProps } from './BidNavbar';

const Container = styled(Box)`
  width: 100%;
  z-index: 50;
  box-shadow: 0 20px 20px -20px rgba(0, 0, 0, 0.19);
  background: ${theme.white};
  @media (max-width: 768px) {
    padding-right: 45px;
  }  
`;

export const Header = (props: { bidNav?: BidNavProps }) => {
  const [user] = useUser();
  const { bidNav } = props;

  return (
    <Container>
      {bidNav ? (
        <BidNavbar {...bidNav} />
      ) : (
        <>
          {!user && <MarketingNavbar />}
          <AppNavbar loggedInUser={user} sections={NavRouteSections} />
        </>
      )}
    </Container>
  );
};

export default Header;
