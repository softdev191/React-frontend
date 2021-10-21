import React, { useEffect, useRef, useState } from 'react';

import { Select, SelectProps } from '@rmwc/select';
import { TextFieldHTMLProps } from '@rmwc/textfield';
import { Icon } from '@rmwc/icon';

import theme from '../constants/Theme';
import styled from '../styled-components';
import { ButtonWithRipple, TextField, Box } from '.';
import { ButtonWithRippleProps } from './ButtonWithRipple';
import { TextFieldProps } from './TextField';

type ListPaginationProps = {
  current: number;
  total: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
`;

const PaginationButton = styled((props: ButtonWithRippleProps & { isHidden?: boolean }) => {
  const { children, ...rest } = props;
  return <ButtonWithRipple {...rest}>{children}</ButtonWithRipple>;
})<ButtonWithRippleProps>`
  width: fit-content;
  height: 27px;
  border: 1px solid ${theme.black};
  border-radius: 2em;
  padding: 0 15px;
  font-family: 'Nunito Sans', Helvetica, Roboto, Arial;
  font-size: small;
  font-weight: 700;
  letter-spacing: normal;
  text-transform: none;
  color: ${theme.black};
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

const PaginationArrowButton = styled(PaginationButton)<ButtonWithRippleProps>`
  width: 27px;
  padding: 0 1px;
  border: none;
  background: ${theme.silverAlice};
  color: ${theme.white};
  i {
    vertical-align: middle;
  }
  &:disabled {
    cursor: default;
  }
`;

const PageInput = styled(TextField)<TextFieldProps & TextFieldHTMLProps>`
  margin-right: 8px;
  label {
    border-radius: 0px;
    height: 32px;
  }
  input {
    background: ${theme.white};
    padding: 0 4px !important;
    width: 30px;
    text-align: right;
  }
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  .mdc-line-ripple::before,
  .mdc-line-ripple::after {
    border-bottom: none;
  }
`;

const PageLimitSelect = styled(Select)<SelectProps & { defaultValue: string; onChange: (event: any) => void }>`
  margin: 0 13px 0 8px;
  width: 65px;
  height: 32px;
  .mdc-line-ripple::before,
  .mdc-line-ripple::after {
    border-bottom: none;
  }
  &&& {
    .mdc-select__anchor {
      background-color: ${theme.white};
      border-radius: 0;
      height: 32px;
      .mdc-select__selected-text {
        padding: 0px 10px;
      }
      .mdc-select__dropdown-icon {
        background: none;
        width: 0;
        height: 0;
        right: 10px;
        top: 9px;
        border-left: 5px solid #0000;
        border-right: 5px solid #0000;
        border-top: 5px solid ${theme.grey};
      }
      .mdc-select__selected-text {
        min-width: unset;
        width: auto;
      }
    }
    &.mdc-select--focused .mdc-select__dropdown-icon {
      border-top: 5px solid ${theme.primary};
    }
  }
`;

export const LIST_PAGE_SIZES = [10, 50, 100];
const pageSizes = LIST_PAGE_SIZES.map(item => item.toString());

function ListPagination(props: ListPaginationProps) {
  const { current, total, limit, isLoading, onLimitChange, onPageChange } = props;
  const [currentPage, setCurrentPage] = useState(current);
  const [isFirst, setIsFirst] = useState(current <= 1);
  const [isLast, setIsLast] = useState(current >= total);
  const pageInputRef = useRef(null);

  useEffect(() => {
    setCurrentPage(current);
    setIsFirst(current <= 1);
    setIsLast(current >= total);
  }, [current, total]);

  const onInputPage = (e: any) => {
    let value = Math.abs(+e.target.value) || 1;
    value = value > total ? total : value;
    setCurrentPage(value);
    onPageChange(value);
  };

  const onNextPrevPage = (page: number) => {
    if (page && page <= total) {
      onPageChange(page);
    }
  };

  const onEnterPage = (e: any) => {
    if (e.keyCode === 13) {
      ((pageInputRef.current as unknown) as HTMLElement).blur();
    }
  };

  return (
    <Container>
      <Box variant='centeredRow' mr={4}>
        Show
        <PageLimitSelect
          enhanced
          options={pageSizes}
          defaultValue={pageSizes[0]}
          value={limit.toString()}
          onChange={(e: any) => onLimitChange(e.target.value)}
          disabled={isLoading}
        />
        Per page
      </Box>
      <Box display='flex' alignItems='center'>
        <PaginationButton
          variant='outline'
          rippleColor={theme.black}
          mr={2}
          onClick={() => onPageChange(1)}
          isHidden={isFirst}
          disabled={isLoading}
        >
          First
        </PaginationButton>
        <PaginationArrowButton textAlign='start' mr={2} onClick={() => onNextPrevPage(current - 1)} disabled={isFirst || isLoading}>
          <Icon icon='chevron_left' />
        </PaginationArrowButton>
        <Box variant='centeredRow' mr={2}>
          <PageInput
            inputRef={pageInputRef}
            type='number'
            value={currentPage}
            onChange={(e: any) => setCurrentPage(e.target.value)}
            onBlur={onInputPage}
            onKeyDown={onEnterPage}
            disabled={isLoading}
          />
          {`/ ${total}`}
        </Box>
        <PaginationArrowButton textAlign='end' mr={2} onClick={() => onNextPrevPage(current + 1)} disabled={isLast || isLoading}>
          <Icon icon='chevron_right' />
        </PaginationArrowButton>
        <PaginationButton
          variant='outline'
          rippleColor={theme.black}
          onClick={() => onPageChange(total)}
          isHidden={isLast}
          disabled={isLoading}
        >
          Last
        </PaginationButton>
      </Box>
    </Container>
  );
}

export default ListPagination;
