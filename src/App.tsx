import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import { SnackbarQueue } from '@rmwc/snackbar';

import styled, { ThemeProvider } from './styled-components';
import theme, { GlobalThemeStyle } from './constants/Theme';
import MediaProvider from './lib/media/media.context';
import UserProvider from './lib/user/user.context';
import WebSnackbarQueue from './lib/WebSnackbarQueue';
import AppRouteSections from './features/AppRouteSections';
import BidProvider from './lib/bid/bid.context';
import SubscriptionProvider from './lib/user/subscription.context';

const StyledSnackbarQueue = styled(SnackbarQueue)`
  > div {
    background: ${theme.alabaster};
  }
  .mdc-snackbar__label {
    color: ${theme.black};
  }
  button * {
    font-size: 22px;
    font-weight: 900;
    color: ${theme.primary};
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <GlobalThemeStyle />
        <BrowserRouter>
          <QueryParamProvider ReactRouterRoute={Route}>
            <MediaProvider>
              <UserProvider>
                <SubscriptionProvider>
                  <BidProvider>
                    <div className='App'>
                      <AppRouteSections />
                      <StyledSnackbarQueue messages={WebSnackbarQueue.messages} />
                    </div>
                  </BidProvider>
                </SubscriptionProvider>
              </UserProvider>
            </MediaProvider>
          </QueryParamProvider>
        </BrowserRouter>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
