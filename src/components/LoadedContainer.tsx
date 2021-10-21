import React, { PropsWithChildren } from 'react';
import { CircularProgress } from '@rmwc/circular-progress';

import styled from '../styled-components';
import Box, { BoxProps } from './Box';

type LoadedContainerProps = PropsWithChildren<BoxProps & { isLoading?: boolean }>;

export const CenteredContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

export const LoadedContainer = styled((props: LoadedContainerProps) => {
  const { isLoading, children, color, ...rest } = props;
  return isLoading ? (
    <CenteredContainer>
      <CircularProgress size='large' />
    </CenteredContainer>
  ) : (
    <Box {...rest}>{children}</Box>
  );
})``;

export default LoadedContainer;
