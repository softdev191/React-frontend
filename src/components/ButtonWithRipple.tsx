import React from 'react';
import { Ripple } from '@rmwc/ripple';

import { Button } from './';
import { ButtonProps } from './Button';
import styled from '../styled-components';
import theme from '../constants/Theme';

export type ButtonWithRippleProps = ButtonProps & {
  children: React.ReactNode;
  rippleColor?: string;
  color?: string;
};

const defaultRippleColors = Object.freeze({
  primary: theme.white,
  secondary: theme.black,
  outline: theme.primary,
  clear: theme.black,
  gradient: theme.white,
  default: theme.black,
  disabled: theme.white
});

const ButtonWithRipple = styled((props: ButtonWithRippleProps) => {
  const { children, rippleColor, ...rest } = props;

  return (
    <Ripple>
      <Button {...rest}>{children}</Button>
    </Ripple>
  );
})`
  &.mdc-ripple-surface::before,
  &.mdc-ripple-surface::after {
    background-color: ${({ rippleColor, variant }) =>
      rippleColor || (variant ? defaultRippleColors[variant] : defaultRippleColors.default)};
  }
`;

export default ButtonWithRipple;
