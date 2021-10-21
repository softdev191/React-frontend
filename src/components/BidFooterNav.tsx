import React from 'react';
import { CircularProgress } from '@rmwc/circular-progress';

import theme from '../constants/Theme';
import styled from '../styled-components';
import { Box, ButtonWithRipple } from './';
import { BidNavProps } from './BidNavbar';

const Container = styled.div`
  width: 100%;
  height: 100px;
  background: ${theme.white};
`;

const NavLinkGroup = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 85%;
  height: 100%;
  margin: auto;

  a {
    max-width: 45%;
  }
`;

const StyledButton = styled(ButtonWithRipple)`
  padding-top: 0px;
  height: 62px;
  font-size: 2.5rem;
  border-radius: 50px;
  width: 180px;
  max-width: 45%;
`;

const StyledButtonCreateBid = styled(ButtonWithRipple)`
  padding-top: 0px;
  height: 62px;
  font-size: 2.5rem;
  border-radius: 50px;
  width: 224px;
  max-width: 45%;
`;

const StyledSpinner = styled(CircularProgress)`
  vertical-align: middle;
  margin-left: 8px;
  color: ${theme.white};
`;

export const BidFooterNav = (props: BidNavProps) => {
  const { onPreviousPage, onNextPage, onCreateNewBid, onFinalizeBid, isSubmitting } = props;

  return (
    <Container>
      <NavLinkGroup justifyContent={onPreviousPage ? 'space-between' : 'flex-end'}>
        {onPreviousPage && (
          <StyledButton variant='primary' onClick={onPreviousPage}>
            Back
          </StyledButton>
        )}
        {onNextPage && (
          <StyledButton variant='primary' type='submit' onClick={onNextPage} disabled={isSubmitting}>
            Next
            {isSubmitting && <StyledSpinner />}
          </StyledButton>
        )}
        {onFinalizeBid && (
          <StyledButton variant='primary' type='submit' onClick={onFinalizeBid} disabled={isSubmitting}>
            Finalize Bid
            {isSubmitting && <StyledSpinner />}
          </StyledButton>
        )}
        {onCreateNewBid && (
          <StyledButtonCreateBid variant='primary' type='submit' onClick={onCreateNewBid} disabled={isSubmitting}>
            Create New Bid
            {isSubmitting && <StyledSpinner />}
          </StyledButtonCreateBid>
        )}
      </NavLinkGroup>
    </Container>
  );
};

export default BidFooterNav;
