import React from 'react';
import { Button, ButtonProps } from '@rmwc/button';

import styled from '../styled-components';

const MAX_WIDTH = 5;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

type PaginationProps = {
  className?: string;
  current: number;
  total: number;
  onPageChange: (page: number) => void;
};

const StyledButton = styled(Button)<ButtonProps & { onClick: () => void }>`
  &&& {
    min-width: 30px;
    padding: 0;
    margin: 10px 2px;
  }
`;

function Pagination(props: PaginationProps) {
  const { className, current, total, onPageChange } = props;
  const range = generateRange(current, total);
  return (
    <Container className={className}>
      {range.map(r => (
        <StyledButton
          key={r}
          outlined={r === current}
          label={r}
          // disabled={r === current}
          onClick={() => onPageChange(r)}
        />
      ))}
    </Container>
  );
}

function generateRange(current: number, total: number) {
  const half = Math.floor(MAX_WIDTH / 2);
  let start = Math.min(Math.max(current - half, 1), Math.max(total - MAX_WIDTH + 1, 1));
  let end = Math.max(Math.min(total, current + half), Math.min(total, MAX_WIDTH));

  const range: number[] = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
}

export default Pagination;
