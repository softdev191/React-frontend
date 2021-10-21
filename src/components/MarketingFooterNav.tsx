import React from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Image } from './';
import theme from '../constants/Theme';
import styled from '../styled-components';
import { logo } from '../assets/images';
import NavLink, { NavbarProps } from './NavLink';

const MarketingFooterNavLink = styled(NavLink)`
  width: 182px;
  font-size: 26px;
  font-weight: 800;
  border: none;
  &&& {
    color: ${theme.black};
    &:hover {
      color: ${theme.pelorous};
    }
  }
`;

const Container = styled(Box)`
  width: 80%;
  display: flex;
  justify-content: space-evenly;
  max-width: 1440px;
  display: flex;
  padding: 20px 0 0px;
  row-gap: 20px;
`;

function MarketingFooterNav(props: NavbarProps) {
  const history = useHistory();
  const {
    sections: { marketingFooter }
  } = props;

  return (
    <Container variant='fill' flexWrap={['wrap', 'wrap', 'nowrap']} justifyContent={['center', 'center', 'space-between']}>
      {/* <Box flex={['none', 'none', 'none', 1]}>
        <Image src={logo} height={44} onClick={() => history.push('/home')} />
      </Box> */}
      <Box
        display='flex'
        textAlign={'center'}
        justifyContent={['center', 'center', 'flex-end']}
        flexWrap={['wrap', 'wrap', 'wrap', 'nowrap']}
        overflow='hidden'
      >
        {marketingFooter.map(section => (
          <MarketingFooterNavLink key={section.path} section={section} />
        ))}
      </Box>
    </Container>
  );
}

export default MarketingFooterNav;
