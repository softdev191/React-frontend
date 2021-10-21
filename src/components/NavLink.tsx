import { Button, ButtonProps } from '@rmwc/button';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import theme from '../constants/Theme';
import { RouteDefinition, RouteSection } from '../features/AppRouteSections';
import { UserContextType } from '../lib/user/user.context';
import styled from '../styled-components';

export type NavbarProps = {
  sections: Record<RouteSection, RouteDefinition[]>;
  loggedInUser?: UserContextType;
};

export type NavLinkProps = ButtonProps & {
  section: RouteDefinition | undefined;
  onClick?: () => void;
};

const NavButton = styled(Link)`
  &&& {
    padding: 0 40px;
    background: ${theme.primary};
    border-radius: 2em !important;
    border-bottom: none;
    color: ${theme.white} !important;
  }
`;
const NavLink = styled((props: NavLinkProps) => {
  const { section = { path: '', isButton: false, name: '' }, onClick, ...rest } = props;

  // console.log('secction name /////////////////////', section);

  return (
    // https://rmwc.io/library-integrations
    <Button
      {...rest}
      key={section.path}
      label={section.name}
      onClick={onClick}
      {...(section.path && {
        to: section.path,
        tag: section.isButton ? NavButton : Link
      })}
    />
  );
})`
  margin: 0 15px;
  padding: 0;
  border-radius: 0px;
  font-size: 30px;
  font-weight: 800;
  white-space: nowrap;
  line-height: ${({ section }) => (section?.path === useLocation().pathname ? '35px' : 'none')};
  border-bottom: ${({ section }) => (section?.path === useLocation().pathname ? `1px solid ${theme.black};` : 'none')};
  &&& {
    color: ${theme.black};
    cursor: ${({ section }) => (section?.path === useLocation().pathname ? 'default' : 'pointer')};
    &:hover {
      color: ${({ section }) => (section?.path === useLocation().pathname ? 'auto' : theme.grey)};
    }
    @media (max-width: 768px) {
      flex-flow: column;
      height: ${({ section }) => (section?.name === 'Start Free Trial' ? `82px !important` : 'none')};
      padding-bottom: ${({ section }) =>
        section?.name === 'Overview' ||
        section?.name === 'Plans' ||
        section?.name === 'Details' ||
        section?.name === 'Bid' ||
        section?.name === 'Pricing' ||
        section?.name === 'Bid Preview' ||
        section?.name === 'Export' ||
        section?.name === 'My Bids' ||
        section?.name === 'My Account'
          ? `50px !important`
          : ({ section }) => (section?.name === 'Subscription' || section?.name === 'Sign Out' ? `77px !important` : 'none')};
      font-size: ${({ section }) =>
        section?.name === 'Free Trial' || section?.path === '/home#pricing' || section?.name === 'About Us' || section?.name === 'Contact'
          ? `36px !important`
          : ({ section }) =>
              section?.name === 'Privacy Policy' || section?.name === 'Terms of Use' ? `38px !important` : '55px !important '};
      display: block;
    }
  }

  // removes hover, focus, and active highlight
  .mdc-button__ripple::before,
  .mdc-button__ripple::after {
    background-color: ${({ section }) => (section?.isButton ? 'auto' : 'unset')};
  }
`;

export default NavLink;
