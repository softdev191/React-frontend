import {
  compose,
  color,
  space,
  layout,
  typography,
  flexbox,
  background,
  grid,
  position,
  border,
  shadow,
  BackgroundColorProps,
  ColorProps,
  MarginProps,
  SpaceProps,
  LayoutProps,
  TypographyProps,
  FlexboxProps,
  GridProps,
  BackgroundProps,
  ShadowProps,
  PositionProps,
  BorderProps,
  variant,
  system
} from 'styled-system';
import styled from '../styled-components';

export type BoxProps = {
  cursor?: string;
  visibility?: string;
  transition?: string;
  variant?: 'centeredColumn' | 'centeredRow' | 'fill';
  open?: boolean;
} & BackgroundColorProps &
  ColorProps &
  MarginProps &
  SpaceProps &
  LayoutProps &
  TypographyProps &
  FlexboxProps &
  GridProps &
  BackgroundProps &
  BorderProps &
  PositionProps &
  ShadowProps;

const Box = styled.div<BoxProps>(
  system({
    cursor: true,
    visibility: true,
    transition: true,
    open: true
  }),
  compose(
    color,
    space,
    layout,
    typography,
    flexbox,
    grid,
    background,
    border,
    position,
    shadow,
    variant({
      variants: {
        centeredColumn: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        },
        centeredRow: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        },
        fill: {
          height: '100%',
          width: '100%'
        }
      }
    })
  )
);

export default Box;
