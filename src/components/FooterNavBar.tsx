import React from 'react';

import { Box, Text } from './';
import theme from '../constants/Theme';
import styled from '../styled-components';
import NavLink, { NavbarProps } from './NavLink';

const Container = styled(Box)`
  width: 85%;
  background: ${theme.white};
  margin: 15px 0;
  font-family: 'Nunito Sans';
  font-size: 16px;
  font-weight: 400;
  display: flex;
  flex-wrap: wrap;
`;

const FooterNavLink = styled(NavLink)`
  margin: 0 10px;
  border: none;
  &&& {
    color: ${theme.pelorous};
    text-transform: none;
    letter-spacing: 0em;
  }

  .mdc-button__label {
    font-family: 'Nunito Sans';
    font-weight: 400;
    font-size: 16px;
  }
`;

const FooterNavLinkMB = styled(NavLink)`
  margin: 0 10px;
  border: none;
  &&& {
    color: ${theme.pelorous};
    text-transform: none;
    letter-spacing: 0em;
  }

  .mdc-button__label {
    font-family: 'Nunito Sans';
    font-weight: 400;
    font-size: 16px;
  }
`;

const StyledText = styled(Text)`
  color: ${theme.black};
  font-weight: 400;
  font-size: 16px;
`;

export const FooterNavBar = (props: NavbarProps) => {
  const {
    loggedInUser,
    sections: { footer }
  } = props;

  return (
    <Container variant='centeredRow' style={{ justifyContent: loggedInUser ? 'space-between' : 'center' }}>
      <Box>
        <StyledText mr={10}>{' © 2020 BidVita. All right reserved. '}</StyledText>
      </Box>

      <Box variant='centeredRow' display='flex' flexWrap='wrap' justifyContent='flex-end'>
        {footer.map((section, i) => (
          <React.Fragment key={section.path}>
            {!loggedInUser && <StyledText> | </StyledText>}
            <FooterNavLinkMB section={section} />
          </React.Fragment>
        ))}
      </Box>
    </Container>
  );
};

export default FooterNavBar;
