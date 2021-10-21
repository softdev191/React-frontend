import React, { RefAttributes } from 'react';
import styled from '../styled-components';
import {
  background,
  BackgroundColorProps,
  BackgroundProps,
  border,
  BorderProps,
  color,
  compose,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  OpacityProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  system
} from 'styled-system';

import Box from './Box';

export type ImageProps = {
  src?: string;
  alt?: string;
  objectFit?: string;
  transform?: string;
  crossOrigin?: string;
} & BackgroundColorProps &
  BackgroundProps &
  BorderProps &
  FlexboxProps &
  LayoutProps &
  OpacityProps &
  PositionProps &
  SpaceProps &
  React.HTMLAttributes<HTMLImageElement> &
  RefAttributes<HTMLImageElement>;

const BaseImage = styled(Box).attrs({
  as: 'img'
})<ImageProps>(
  system({
    objectFit: true,
    transform: true,
    crossOrigin: true
  }),
  {
    objectFit: 'contain'
  },
  compose(background, border, color, flexbox, layout, position, space)
);

export const Image = React.forwardRef<HTMLImageElement, ImageProps>((props: ImageProps, ref) => {
  return <BaseImage ref={ref} {...(props.onClick && { cursor: 'pointer' })} {...props} />;
});

export default Image;
