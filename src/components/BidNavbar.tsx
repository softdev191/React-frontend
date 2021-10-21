import React, { useEffect, useState } from 'react';
import { Icon } from '@rmwc/icon';
import { CircularProgress } from '@rmwc/circular-progress';
import { Dialog, DialogActions, DialogButton, DialogContent, DialogTitle } from '@rmwc/dialog';
import { ButtonHTMLProps } from '@rmwc/button';

import { logo } from '../assets/images/';
import theme from '../constants/Theme';
import styled from '../styled-components';
import { RouteDefinition } from '../features/AppRouteSections';
import { Box, ButtonWithRipple, Image, Text } from './';
import NavLink from './NavLink';
import { trashIcon } from '../assets/images/';
import { useHistory } from 'react-router-dom';
import { useDeleteBid } from '../lib/api/Bid.hooks';
import WebSnackbarQueue from '../lib/WebSnackbarQueue';
import { SuccessMessages } from '../constants/Strings';
import useBid from '../lib/bid/useBid';
import { PlansUploaded } from '../constants/Bid';

export type BidNavProps = {
  bidId: number;
  isSubmitting?: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onCreateNewBid?: () => void;
  onSave?: () => void;
  onSaveAndClose?: () => void;
  onFinalizeBid?: () => void;
};

const NavSection = styled(Box)`
  display: flex;
  flex: auto;

  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background-color: #fff;
    border-left: 1px solid;
    padding-top: 50px;
    position: fixed;
    top: 0;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(100%)')};
    right: 0;
    height: 66vh;
    width: 500px;
    flexdirection: 'column';
    alignitems: 'center';
    padding-top: 3.5rem;
    z-index: 4;
    transition: transform 0.3s ease-in-out;
    .cWBqUI {
      z-index: 1;
    }
  }
`;
const NavSubSection = styled(Box)`
  display: flex;
  flex: auto;
  @media (max-width: 768px) {
    display: block;
    flex: none;

    button {
      width: 110px;
    }
  }
`;

const StyledBurger = styled(Box)`
  width: 2rem;
  height: 2rem;
  position: fixed;
  top: 15px;
  right: 20px;
  z-index: 20;
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }
  div {
    width: 2rem;
    height: 0.25rem;
    border-radius: 10px;
    background-color: ${({ open }) => (open ? '#ccc' : '#333')};
    transform-origin: 1px;
    transition: all 0.3s linear;

    &:nth-child(1) {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }
    &:nth-child(2) {
      transform: ${({ open }) => (open ? 'translateX(100%)' : 'translateX(0)')};
      opacity: ${({ open }) => (open ? 0 : 1)};
    }
    &:nth-child(3) {
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;

const TitleContainer = styled.div`
  background: ${theme.alabaster};
  height: 100%;
  min-width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-right: 18px;
  @media (max-width: 768px) {
    min-width: 100px;

    p {
      font-size: 14px;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
`;

const DeleteButton = styled(ButtonWithRipple)`
  width: 45px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    display: inline-block;
  }
`;

const StyledSpinner = styled(CircularProgress)`
  margin-right: 16px;
  color: ${theme.primary};
`;

const StyledDialogButton = styled(DialogButton)`
  font-size: 22px;
  font-weight: 900;
`;

const DialogCancelButton = styled(StyledDialogButton)<ButtonHTMLProps>`
  && {
    color: ${theme.grey};
  }
`;

const DialogDeleteButton = styled(StyledDialogButton)<ButtonHTMLProps>`
  && {
    color: ${theme.destructiveColor};
  }
`;

const notifyBidDeletion = () =>
  WebSnackbarQueue.notify({
    dismissesOnAction: true,
    title: SuccessMessages.PROJECT_DELETE_SUCCEEDED,
    actions: [
      {
        label: 'DISMISS'
      }
    ]
  });

export const BidNavbar = (props: BidNavProps) => {
  const { bidId, isSubmitting, onSave, onSaveAndClose } = props;
  const title = Number(bidId) ? 'Edit Project' : 'New Project';

  const history = useHistory();
  const deleteBid = useDeleteBid(bidId);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [bid] = useBid();

  useEffect(() => {
    if (deleteBid.data && !deleteBid.error && !deleteBid.isLoading) {
      notifyBidDeletion();
      history.push('/bids');
    } else if (deleteBid.error && !deleteBid.isLoading) {
      setIsDeleting(false);
    }
  }, [history, deleteBid.data, deleteBid.error, deleteBid.isLoading]);

  const handleDelete = () => {
    if (bidId) {
      setIsDeleting(true);
      deleteBid.mutate();
    } else {
      notifyBidDeletion();
      history.push('/bids');
    }
  };

  return (
    <Box variant='centeredRow' height={100} px={[13, 17, 30, 34]} maxWidth={1440} m='auto' overflow='auto hidden'>
      <Image src={logo} height={45} mr={4} onClick={() => history.push('/bids')} />
      {/* <TitleContainer>
        <Text variant='appNavBar' textTransform='uppercase !important'>
          {title}
        </Text>
      </TitleContainer> */}
      <StyledBurger open={open} onClick={() => setOpen(!open)}>
        <div />
        <div />
        <div />
      </StyledBurger>
      <NavSection open={open}>
        <NavSubSection justifyContent='flex-start'>
          {!!bidId ? (
            <>
              <NavLink section={{ name: 'Overview', path: `/bids/${bidId}/overview` } as RouteDefinition} />
              {bid?.hasPlans !== PlansUploaded.NO_UPLOAD && (
                <NavLink section={{ name: 'Plans', path: `/bids/${bidId}/plans` } as RouteDefinition} />
              )}
              {bid?.hasPlans !== PlansUploaded.WILL_UPLOAD && (
                <NavLink section={{ name: 'Details', path: `/bids/${bidId}/details` } as RouteDefinition} />
              )}
              {bid?.hasEstimate && bid?.hasPlans !== PlansUploaded.WILL_UPLOAD && (
                <>
                  <NavLink section={{ name: 'Bid', path: `/bids/${bidId}/estimates` } as RouteDefinition} />
                  <NavLink section={{ name: 'Pricing', path: `/bids/${bidId}/pricing` } as RouteDefinition} />
                  <NavLink section={{ name: 'Bid Preview', path: `/bids/${bidId}/bid-preview` } as RouteDefinition} />
                  <NavLink section={{ name: 'Export', path: `/bids/${bidId}/export` } as RouteDefinition} />
                </>
              )}
            </>
          ) : (
            <NavLink section={{ name: 'Overview', path: `/bids/new/overview` } as RouteDefinition} />
          )}
        </NavSubSection>
      </NavSection>

      {(isSubmitting || isDeleting) && <StyledSpinner />}
      {onSave && (
        <ButtonWithRipple
          variant='primary'
          type='submit'
          fontSize={22}
          width={120}
          mr={3}
          onClick={onSave}
          disabled={isSubmitting || isDeleting}
        >
          Save
        </ButtonWithRipple>
      )}
      {onSaveAndClose && (
        <ButtonWithRipple
          variant='outline'
          type='submit'
          fontSize={22}
          lineHeight={1}
          width={157}
          mr={3}
          onClick={onSaveAndClose}
          disabled={isSubmitting || isDeleting}
        >
          Save & Close
        </ButtonWithRipple>
      )}
      <DeleteButton variant='clear' onClick={() => setIsDeleteDialogOpen(true)} disabled={isSubmitting || isDeleting}>
        <Icon icon={trashIcon}></Icon>
      </DeleteButton>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>Proceed to delete project?</DialogContent>
        <DialogActions>
          <DialogCancelButton action='cancel'>Cancel</DialogCancelButton>
          <DialogDeleteButton action='delete' onClick={handleDelete}>
            Delete
          </DialogDeleteButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BidNavbar;
