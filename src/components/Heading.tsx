import styled from '../styled-components';
import {
  color,
  ColorProps,
  compose,
  layout,
  LayoutProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps
} from 'styled-system';

type HeadingProps = SpaceProps & ColorProps & LayoutProps & ShadowProps & TypographyProps;

const Heading = styled.h1<HeadingProps>(compose(space, color, layout, shadow, typography));

export default Heading;
