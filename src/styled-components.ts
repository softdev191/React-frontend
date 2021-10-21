import * as styledComponents from 'styled-components';

import { Theme } from './constants/Theme';

const {
  default: styled,
  css,
  withTheme,
  ThemeProvider,
  createGlobalStyle
} = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>;

export { css, withTheme, ThemeProvider, createGlobalStyle };
export default styled;
