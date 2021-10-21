import { ButtonHTMLAttributes } from 'react';
import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
  variant
} from 'styled-system';
import styled from '../styled-components';
import theme from '../constants/Theme';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'clear' | 'gradient' | 'disabled';
  type?: 'submit' | 'button';
} & SpaceProps &
  LayoutProps &
  ColorProps &
  BorderProps &
  BackgroundProps &
  FlexboxProps &
  PositionProps &
  TypographyProps &
  ShadowProps &
  ButtonHTMLAttributes<any>;

const Button = styled.button<ButtonProps>(
  {
    height: '44px',
    borderRadius: '22px',
    width: '50%',
    outline: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    textTransform: 'uppercase',
    fontFamily: 'Chathura',
    fontSize: '1.625rem', // 26px
    letterSpacing: '2px',
    fontWeight: 800
  },
  space,
  flexbox,
  layout,
  position,
  color,
  border,
  background,
  typography,
  shadow,
  variant({
    variants: {
      primary: {
        border: 'none',
        color: 'white',
        bg: `${theme.primary}`
      },
      secondary: {
        border: 'none',
        color: `${theme.primary}`,
        bg: `${theme.secondary}`
      },
      outline: {
        border: `2px solid ${theme.primary}`,
        color: `${theme.primary}`,
        bg: 'unset'
      },
      clear: {
        border: 'none',
        color: 'primary',
        bg: 'unset'
      },
      gradient: {
        border: 'none',
        color: 'white',
        backgroundImage: 'linear-gradient(-90deg, #517BD3, #79BBF7)',
        fontSize: ['15px', '20px', '25px', '30px'],
        fontFamily: 'Roboto'
      },
      disabled: {
        border: 'none',
        color: `${theme.white}`,
        bg: `${theme.secondary}`
      }
    }
  })
);

export default Button;
