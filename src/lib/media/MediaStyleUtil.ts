import { ThemedCssFunction } from 'styled-components';

import { Theme } from '../../constants/Theme';
import { css } from '../../styled-components';
import Defaults from '../../constants/Defaults';

export const media = (Object.keys(Defaults.MEDIA_BREAKPOINTS) as (keyof typeof Defaults.MEDIA_BREAKPOINTS)[]).reduce(
  (acc, label) => {
    acc[label] = (first: any, ...interpolations: any[]) => css`
      @media (min-width: ${Defaults.MEDIA_BREAKPOINTS[label]}px) {
        ${css(first, ...interpolations)};
      }
    `;

    return acc;
  },
  {} as { [key in keyof typeof Defaults.MEDIA_BREAKPOINTS]: ThemedCssFunction<Theme> }
);

export default media;
