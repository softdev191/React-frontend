import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Image } from './';
import styled from '../styled-components';
import { RouteDefinition } from '../features/AppRouteSections';
import { useLogout } from '../lib/api/User.hooks';
import { logo } from '../assets/images/';
import NavLink, { NavbarProps } from './NavLink';

const NavSection = styled(Box)`
  display: flex;
  flex: auto;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background-color: #fff;
    border-left:1px solid;
    padding-top:50px;
    position: fixed;
    top: 0;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(100%)')};
    right: 0;
    height: 66vh;
    width: 500px;
    flexDirection: 'column',
    alignItems: 'center'
    padding-top: 3.5rem;
    transition: transform 0.3s ease-in-out;

  }
`;

const NavSubSection = styled(Box)`
  display: flex;
  flex: auto;
  @media (max-width: 768px) {
    display: block;
    flex: none;
  }
`;

const StyledBurger = styled(Box)`
  width: 2rem;
  height: 2rem;
  position: fixed;
  top: 15px;
  right: 20px;
  z-index: 20;
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }
  div {
    width: 2rem;
    height: 0.25rem;
    border-radius: 10px;
    background-color: ${({ open }) => (open ? '#ccc' : '#333')};
    transform-origin: 1px;
    transition: all 0.3s linear;

    &:nth-child(1) {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }
    &:nth-child(2) {
      transform: ${({ open }) => (open ? 'translateX(100%)' : 'translateX(0)')};
      opacity: ${({ open }) => (open ? 0 : 1)};
    }
    &:nth-child(3) {
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;
export const AppNavbar = (props: NavbarProps) => {
  const { doLogout } = useLogout();
  const history = useHistory();
  const {
    loggedInUser,
    sections: { account, visitor }
  } = props;
  const handleLogout = async () => {
    await doLogout();
    history.push('/signin');
  };
  const [open, setOpen] = useState(false);

  // console.log('loggedInUser loggedInUserloggedInUser loggedInUserloggedInUser loggedInUser', loggedInUser);
  return (
    <Box variant='centeredRow' height={100} px={[13, 17, 30, 45]} maxWidth={1440} margin='auto' overflow='auto hidden'>
      <Image
        src={logo}
        height={45}
        mr={4}
        onClick={() => {
          !loggedInUser ? history.push('/home') : history.push('/bids');
        }}
      />
      <StyledBurger open={open} onClick={() => setOpen(!open)}>
        <div />
        <div />
        <div />
      </StyledBurger>
      <NavSection open={open}>
        <NavSubSection justifyContent='flex-start'>
          {!!loggedInUser &&
            account.map(section => (
              <>
                <NavLink key={section.path} section={section} />
                <br />
              </>
            ))}
        </NavSubSection>
        <NavSubSection justifyContent='flex-end'>
          {!!loggedInUser ? (
            <NavLink section={{ name: 'Sign Out' } as RouteDefinition} onClick={handleLogout} />
          ) : (
            visitor.map(section => (
              <>
                <NavLink key={section.path} section={section} />
                <br />
              </>
            ))
          )}
        </NavSubSection>
      </NavSection>
    </Box>
  );
};

export default AppNavbar;
