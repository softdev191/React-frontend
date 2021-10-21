import React, { PropsWithChildren } from 'react';
import styled from '../styled-components';

type TopDownGridProps = PropsWithChildren<{
  rows?: number;
  gridTemplateColumns?: string;
}>;

export const TopDownGrid = styled((props: TopDownGridProps) => {
  const { children, gridTemplateColumns, ...rest } = props;
  return <div {...rest}>{children}</div>;
})`
  display: grid;
  grid-template-columns: ${props => props.gridTemplateColumns || 'auto'};
  grid-template-rows: repeat(${({ rows }) => rows || 1}, 1fr);
  grid-auto-flow: column;
`;

export const TopDownGrid30 = styled((props: TopDownGridProps) => {
  const { children, gridTemplateColumns, ...rest } = props;
  return <div {...rest}>{children}</div>;
})`
  display: grid;
  grid-template-columns: 30%;
  grid-template-rows: repeat(${({ rows }) => rows || 1}, 1fr);
  grid-auto-flow: column;
`;
