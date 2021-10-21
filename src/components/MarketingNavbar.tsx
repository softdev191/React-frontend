import React from 'react';
import { Link } from 'react-router-dom';

import { Button, ButtonProps } from '@rmwc/button';
import { TagT } from '@rmwc/types/dist';

import { Box } from './';
import theme from '../constants/Theme';
import styled from '../styled-components';
import { PRICING_HASH } from '../features/home/Home';

const Container = styled(Box)`
  height: 44px;
  max-width: 1440px;
  display: flex;
  justify-content: flex-end;
  margin: auto;
  white-space: nowrap;
  @media (max-width: 768px) {
    padding-right: 45px;
  }
`;

const NavLink = styled(Button)<ButtonProps & { tag?: TagT; to?: string; href?: string }>`
  margin: 0 15px;
  padding: 0 5px;

  &&& {
    font-family: 'Chathura';
    font-weight: 800;
    font-size: 24px;
    color: ${theme.black};
    &:hover {
      color: ${theme.pelorous};
    }
  }
`;

export const MarketingNavbar = () => {
  return (
    <Box background={theme.alabaster}>
      <Container variant='centeredRow' px={[13, 17, 30, 34]}>
        <NavLink label='(888) 123-4567' tag='a' href='tel:+1-888-123-4567' />
        <NavLink label='Pricing' tag={Link} to={'/home' + PRICING_HASH} />
      </Container>
    </Box>
  );
};

export default MarketingNavbar;
