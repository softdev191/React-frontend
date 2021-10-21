import React from 'react';

import theme from '../constants/Theme';
import styled from '../styled-components';
import { NavRouteSections } from '../features/AppRouteSections';
import { Box, FooterNavBar, MarketingFooterNav, BidFooterNav } from './';
import { BidNavProps } from './BidNavbar';

type FooterProps = { bidNav?: BidNavProps; loggedInUser: any };

function Footer(props: FooterProps) {
  const { bidNav, loggedInUser } = props;

  return (
    <Box
      style={{ zIndex: 999 }}
      boxShadow={bidNav ? '0 20px 10px 20px rgba(0, 0, 0, 0.19)' : 'none'}
      width='100%'
      m='auto auto 0'
      position='fixed'
      top='auto'
      bottom='0'
      left='0'
      right='0'
      z-index='999'
      background='#fff'
    >
      <Container variant='centeredRow' className='app-footer'>
        {bidNav ? (
          <BidFooterNav {...bidNav} />
        ) : (
          <>
            {!loggedInUser && <MarketingFooterNav sections={NavRouteSections} />}
            <FooterNavBar loggedInUser={loggedInUser} sections={NavRouteSections} />
          </>
        )}
      </Container>
    </Box>
  );
}

const Container = styled(Box)`
  width: 100%;
  max-width: 1440px;
  height: auto;
  flex-direction: column;
  background-color: ${theme.white};
  margin: auto;
`;

export default Footer;
