import styled from '../styled-components';
import {
  border,
  BorderProps,
  color,
  ColorProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
  variant
} from 'styled-system';

type LinkProps = { variant?: 'nav' } & SpaceProps & ColorProps & LayoutProps & BorderProps & TypographyProps;

const Link = styled.a<LinkProps>(
  space,
  color,
  layout,
  typography,
  border,
  variant({
    variants: {
      nav: {
        textDecoration: 'none'
      }
    }
  })
);

export default Link;
