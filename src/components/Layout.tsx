import React, { PropsWithChildren, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import styled from '../styled-components';
import useUser from '../lib/user/useUser';
import { Header, Content, Footer, PageBanner, SubscriptionAlert, Box } from './';
import { BoxProps } from './Box';
import { BidNavProps } from './BidNavbar';
import { patternHeader, patternFooter, homepagePattern } from '../assets/images';

type LayoutProps = PropsWithChildren<RouteComponentProps & BoxProps> & {
  headerHidden?: boolean;
  footerHidden?: boolean;
  hideSubscriptionAlert?: boolean;
  hidePatternHeader?: boolean;
  hidePatternFooter?: boolean;
  showHomePattern?: boolean;
  bidNav?: BidNavProps;
  banner?: {
    image: string;
    text: string;
  };
};

type BackgroundOptions = {
  hidePatternHeader?: boolean;
  hidePatternFooter?: boolean;
  showHomePattern?: boolean;
  hasBanner?: boolean;
};

const getPatternStyles = (options: BackgroundOptions) => {
  const { hidePatternHeader, hidePatternFooter, showHomePattern, hasBanner } = options;

  const homeTop = -50;
  const headerTop = !hasBanner ? -150 : 0;

  const headerImg = showHomePattern ? `url(${homepagePattern})` : !hidePatternHeader ? `url(${patternHeader})` : 'none';
  const footerImg = hidePatternFooter ? 'none' : `url(${patternFooter})`;

  const headerPosition = showHomePattern ? `right 0 top ${homeTop}px` : !hidePatternHeader ? `right 8% top ${headerTop}px` : 0;
  const footerPosition = !hidePatternFooter ? 'left 8% bottom 0' : 0;

  const headerSize = showHomePattern ? '670px' : '500px';

  return `
    background-image: ${headerImg}, ${footerImg};
    background-position: ${headerPosition}, ${footerPosition};
    background-repeat: no-repeat, no-repeat;
    background-size: ${headerSize}, 500px;
  `;
};

const Container = styled(Box)`
  width: inherit;
  height: auto;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const BackgroundContainer = styled((props: PropsWithChildren<BackgroundOptions>) => {
  const { children, ...rest } = props;
  return <Box {...rest}>{children}</Box>;
})`
  ${props => getPatternStyles(props)}
  max-width: 1950px;
  width: 130%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-self: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

/**
 * Provides the header based on routes available in AppRouteSections.
 * Usage: use as root element in your feature component.
 */
function Layout(props: LayoutProps) {
  const {
    headerHidden,
    footerHidden,
    hidePatternHeader,
    hidePatternFooter,
    showHomePattern,
    hideSubscriptionAlert,
    bidNav,
    banner,
    children,
    ...rest
  } = props;
  const [user] = useUser();

  useEffect(() => {
    const body = document.querySelector('#root');
    setTimeout(() => {
      body?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []); // eslint-disable-line

  return (
    <>
      <Container>
        {!headerHidden && <Header {...(!!user && { bidNav })} />}
        {!hideSubscriptionAlert && (
          <Box zIndex={1}>
            <SubscriptionAlert />
          </Box>
        )}
        {!!banner && <PageBanner image={banner.image} text={banner.text} />}
        <BackgroundContainer
          hidePatternHeader={hidePatternHeader}
          hidePatternFooter={hidePatternFooter}
          showHomePattern={showHomePattern}
          hasBanner={!!banner}
        >
          <Content {...rest}>{children}</Content>
        </BackgroundContainer>
      </Container>
      {!footerHidden && <Footer loggedInUser={user} {...(!!user && { bidNav })} />}
    </>
  );
}

export default withRouter(Layout);
