import React, { PropsWithChildren } from 'react';

import styled from '../styled-components';
import { Box } from './';
import { BoxProps } from './Box';

const DefaultContent = styled(Box)`
  width: 80%;
  height: 100%;
  display: flex;
  flex: column;
  align-items: center;
  flex-direction: column;
  max-width: 1440px;
  min-height: 750px;
  margin: auto;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
  }
  position: relative;
`;

/**
 * Serves as a mobile-ready container aligned center by default.
 *     styled-system props are accepted.
 *
 * @example <Content>
 *    your component code here
 * </Content>
 */
function Content(props: PropsWithChildren<BoxProps>) {
  const { children, color, ...rest } = props;
  return (
    <DefaultContent className='app-content' {...rest}>
      {children}
    </DefaultContent>
  );
}

export default Content;
