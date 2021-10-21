import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import styled from '../styled-components';
import theme from '../constants/Theme';
import { Image, Text } from './';
import { leftArrow } from '../assets/images';

const SectionBackButton = styled((props: LinkProps) => {
  const { to: redirectPath, ...rest } = props;
  return (
    <Link to={redirectPath} {...rest}>
      <Image src={leftArrow} mr={2} />
      <Text color={theme.primary}>Back</Text>
    </Link>
  );
})`
  text-decoration: none;
  display: flex;
  margin-bottom: 10px;
  margin-top: 20px;
`;

export default SectionBackButton;
