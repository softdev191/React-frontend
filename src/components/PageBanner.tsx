import React from 'react';

import { Box, Text } from './';
import styled from '../styled-components';

type PageBannerProps = {
  image?: string;
  text?: string;
};

const Container = styled(Box)`
  justify-content: center;
  height: 590px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  margin-bottom: 40px;
`;

export const PageBanner = (props: PageBannerProps) => {
  const { image, text } = props;

  return (
    <Container variant='centeredColumn' backgroundImage={image}>
      {text && (
        <Text variant='title' color='#fff' textShadow='0 0 4px #444'>
          {text}
        </Text>
      )}
    </Container>
  );
};

export default PageBanner;
