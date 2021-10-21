import React, { HTMLAttributes, PropsWithChildren, useEffect, useState } from 'react';
import { useQueryParams, NumberParam, StringParam } from 'use-query-params';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogButton } from '@rmwc/dialog';
import { Icon } from '@rmwc/icon';
import { DataTableCell, DataTableCellProps } from '@rmwc/data-table';

import { edit, trashAdd, download, email, deleteIcon, dash } from '../../assets/images';

import { Image, TextField } from '../../components';
import { Link } from 'react-router-dom';

import { Card } from '@rmwc/card';
import {
  DataTable,
  DataTableBody,
  DataTableContent,
  DataTableHead,
  DataTableHeadCell,
  DataTableHeadCellProps,
  DataTableProps,
  DataTableRow,
  DataTableRowProps
} from '@rmwc/data-table';
import { CircularProgress } from '@rmwc/circular-progress';

import { useGetBidsByPage, useGetBidsCount } from '../../lib/api/Bid.hooks';
import { BidListColumns } from './BidTableColumns';
import parseSort from '../../lib/parseSort';
import theme from '../../constants/Theme';
import styled from '../../styled-components';
import { Layout, ButtonWithRipple, Box, ListPagination, Text } from '../../components';
import { ButtonWithRippleProps } from '../../components/ButtonWithRipple';
import { TextProps } from '../../components/Text';
import { LIST_PAGE_SIZES } from '../../components/ListPagination';
import useSubscription from '../../lib/user/useSubscription';
import { SubscriptionStatus } from '../../constants/Subscription';
import { UserGetSubscriptionDTO } from '../../lib/api/User.hooks';
import { API_URL, getAccessToken } from '../../lib/api/Api';
import axios from 'axios';

const FullWidthBar = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 45px;
  justify-content: space-between;
  align-items: center;
  /* Landscape phones and down */
  @media (max-width: 480px) {
    p.sc-eCApGN.eOWZWc {
      font-size: 25px;
    }
  }

  /* Landscape phone to portrait tablet */
  @media (max-width: 767px) {
    p.sc-eCApGN.eOWZWc {
      font-size: 25px;
    }
  }
`;

const StyledCard = styled(Card)`
  height: 630px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
`;

const StyledDataTable = styled(DataTable)<PropsWithChildren<DataTableProps>>`
  flex: 1;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

const StyledDataTableRow = styled(DataTableRow)<PropsWithChildren<DataTableRowProps>>`
  border-bottom: 1px solid ${theme.gainsboro};
`;

const SortableColumnHeader = styled(DataTableHeadCell)<DataTableHeadCellProps & HTMLAttributes<DataTableHeadCellProps>>`
  svg {
    margin: 0;
  }
  min-width: 125px;
  /* justify-content: center; */
`;

const ColumnTitle = styled(Text)<TextProps>`
  float: left;
  user-select: none;
`;

const StyledButton = styled((props: ButtonWithRippleProps & { redirectPath?: string }) => {
  const { redirectPath, children, ...rest } = props;
  return redirectPath ? (
    <Link to={redirectPath}>
      <ButtonWithRipple {...rest}>{children}</ButtonWithRipple>
    </Link>
  ) : (
    <ButtonWithRipple {...rest}>{children}</ButtonWithRipple>
  );
})`
  width: 285px;
  height: 44px;
  border-radius: 2em;

  &:disabled {
    ${props => {
      if (props.variant === 'primary') {
        return `background: ${theme.alto}; color: rgba(0,0,0,.38)`;
      }
      if (props.variant === 'outline') {
        return `color: ${theme.alto}; border-color: ${theme.alto};`;
      }
    }}
  }
`;

export const ActionButton = styled(StyledButton)<ButtonWithRippleProps>`
  width: fit-content;
  height: 30px;
  padding: 0 45px;
  font-size: large;
  line-height: 1;
`;

const DataTableFooter = styled(Box)`
  min-height: 52px;
  background: ${theme.alabaster};
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const CenteredContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const EmptyMessageTitle = styled(Text)<TextProps>`
  color: ${theme.black};
  font-weight: 900;
`;

const ProgressSpinner = () => {
  return (
    <CenteredContainer>
      <CircularProgress size='large' />
    </CenteredContainer>
  );
};

// const getWindowDimensions = () => {
//   const { innerWidth: width, innerHeight: height } = window;
//   return {
//     width,
//     height
//   };
// }

const BidList = () => {
  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    limit: NumberParam,
    sort: StringParam
  });
  const { page, limit = LIST_PAGE_SIZES[0], sort } = query;

  const { data, isLoading, error, get } = useGetBidsByPage();
  const { data: countData, get: getCount, error: countError, isLoading: isLoadingCount } = useGetBidsCount();

  const [mySubscription] = useSubscription();
  const { subscription } = (mySubscription as UserGetSubscriptionDTO) || {};
  const { ACTIVE, NON_RENEWING } = SubscriptionStatus;
  const isRestricted = !(subscription && [ACTIVE, NON_RENEWING].includes(subscription.status));

  const [pdfModal, setPdfOpen] = useState(false);
  const [planModal, setPlanModal] = useState(false);
  const [id, setId] = useState(0);

  const [DeleteInsopen, setDeleteOpen] = useState(false);

  const [isShowPlus, setShowPlus] = useState(true);

  const [Email, setEmail] = useState('');

  // const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    get({
      page: Number(page) || 0,
      limit,
      sort: String(sort || '')
    });
    getCount();
  }, [get, page, limit, sort, getCount]);

  useEffect(() => {
    const totalPages = countData ? Math.ceil(countData / limit) : 0;

    if (!LIST_PAGE_SIZES.includes(limit)) {
      setQuery({ page: 0, limit: LIST_PAGE_SIZES[0] });
    } else if (page && page >= totalPages) {
      setQuery({ page: 0 });
    }
  }, [page, limit, countData, setQuery]);

  // useEffect(() => {
  //   function handleResize() {
  //     setWindowDimensions(getWindowDimensions());
  //   }

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  const setNewSort = (column: string, direction: number | null) => {
    const newSort = direction ? `${column} ${direction > 0 ? 'DESC' : 'ASC'}` : undefined;
    setQuery({ page: 0, sort: newSort });
  };

  const setNewPage = (page: number) => {
    page = page - 1;
    setQuery({ page });
  };

  const setNewLimit = (limit: number) => {
    setQuery({ page: 0, limit });
  };

  let sortObj: any;
  if (sort) {
    sortObj = parseSort(sort as string);
  }
  sortObj = sortObj || { column: '', direction: null };

  const deleteBid = () => {
    axios.delete(`${API_URL}bids/${id}`).then(res => window.location.reload());
  };

  const sendPlan = () => {
    alert('aasnjan akjsm');
    let url = `${API_URL}bids/${id}/download-plans?token=${getAccessToken()}&email=${Email}`;
    axios
      .get(url)
      .then(response => console.log(response))
      .catch(error => console.log(error));
    // window.open(url);
  };

  const sendMail = async () => {
    let url = `${API_URL}bids/${id}/export-estimate?token=${getAccessToken()}&email=${Email}`;
    axios
      .get(url)
      .then(response => console.log(response))
      .catch(error => console.log(error));
    // window.open(url);
  };

  const handleDownload = async id => {
    let url = `${API_URL}bids/${id}/export-estimate?token=${getAccessToken()}`;
    window.open(url);
  };

  function handleDownloadPlans(id) {
    let url = `${API_URL}bids/${id}/download-plans?token=${getAccessToken()}`;
    window.open(url);
  }

  return (
    <>
      <Layout hidePatternFooter>
        <Box my={6} width='85%'>
          <FullWidthBar>
            <Text variant='title'>My Bids</Text>
            {!isRestricted && (
              <StyledButton variant='primary' redirectPath='/bids/new/overview'>
                Create New Bid
              </StyledButton>
            )}
          </FullWidthBar>
          <StyledCard>
            {data && data[0] && !error ? (
              <>
                <StyledDataTable stickyRows={1}>
                  <div className='list-table'>
                    <DataTableContent>
                      <DataTableHead>
                        <DataTableRow>
                          {BidListColumns.map(({ key, title, sortable, headerStyle }) => {
                            return sortable ? (
                              <SortableColumnHeader
                                key={key}
                                style={headerStyle}
                                sort={sortObj.column === key ? sortObj.direction : null}
                                onSortChange={(dir: any) => {
                                  setNewSort(key, dir);
                                }}
                              >
                                <ColumnTitle variant='label'>{title}</ColumnTitle>
                              </SortableColumnHeader>
                            ) : (
                              <DataTableHeadCell key={key} style={headerStyle}>
                                <ColumnTitle variant='label'>{title}</ColumnTitle>
                              </DataTableHeadCell>
                            );
                          })}
                        </DataTableRow>
                      </DataTableHead>
                      <DataTableBody>
                        {!isLoading &&
                          data.map(row => (
                            <StyledDataTableRow key={row.id}>
                              {BidListColumns.map(({ key, renderCell, style, hasAction, hasPopUp }) => {
                                if (key == 'export' && hasPopUp) {
                                  return (
                                    <DataTableCell key={key} style={style}>
                                      {row.cost ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', justifyItems: 'center' }}>
                                          <Image
                                            src={download}
                                            height={20}
                                            mr={4}
                                            className='cursor-pointer'
                                            onClick={() => handleDownload(row.id)}
                                          />
                                          <Image
                                            src={email}
                                            onClick={() => {
                                              setPdfOpen(true);
                                              setId(row.id);
                                            }}
                                            height={20}
                                            ml={3}
                                            mr={4}
                                            className='cursor-pointer'
                                          />
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                          <Image src={dash} height={20} mr={3} />
                                        </div>
                                      )}
                                    </DataTableCell>
                                  );
                                } else if (key == 'name') {
                                  return (
                                    <DataTableCell key={key} style={style}>
                                      <Box display='flex' alignItems='center' style={{ justifyContent: 'space-between' }}>
                                        {isShowPlus && (
                                          <Text variant='tableBody'>{`${(row as Record<string, any>)[key].substring(0, 15) || ''}`}</Text>
                                        )}
                                        {!isShowPlus && <Text variant='tableBody'>{`${(row as Record<string, any>)[key] || ''}`}</Text>}

                                        <AddButton variant='clear' onClick={() => setShowPlus(!isShowPlus)}>
                                          {isShowPlus && <Icon icon={trashAdd}></Icon>}
                                          {!isShowPlus && (
                                            <Icon
                                              icon={
                                                <svg
                                                  version='1.1'
                                                  x='0px'
                                                  y='0px'
                                                  viewBox='0 0 24 30'
                                                  style={{ height: '24px', width: '24px' }}
                                                >
                                                  <path d='M3,5v14c0,1.1045704,0.8954306,2,2,2h14c1.1045704,0,2-0.8954296,2-2V5c0-1.1045694-0.8954296-2-2-2H5  C3.8954306,3,3,3.8954306,3,5z M7,11h10v2H7V11z' />
                                                </svg>
                                              }
                                            ></Icon>
                                          )}
                                        </AddButton>
                                      </Box>
                                      {/* <Text style={{ wordWrap: 'break-word', width: '150px', whiteSpace: 'normal' }} variant='tableBody'>{`${(row as Record<string,any>)[key] || ''}`}</Text> */}
                                    </DataTableCell>
                                  );
                                } else if (key == 'downloadPlans' && hasPopUp) {
                                  return (
                                    <DataTableCell key={key} style={style}>
                                      {+row.plansCount !== 0 ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', justifyItems: 'center' }}>
                                          <Image
                                            src={download}
                                            height={20}
                                            mr={4}
                                            className='cursor-pointer'
                                            onClick={() => handleDownloadPlans(row.id)}
                                          />
                                          <Image
                                            src={email}
                                            onClick={() => {
                                              setPlanModal(true);
                                              setId(row.id);
                                            }}
                                            height={20}
                                            ml={3}
                                            mr={4}
                                            className='cursor-pointer'
                                          />
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                          <Image src={dash} height={20} mr={3} />
                                        </div>
                                      )}
                                    </DataTableCell>
                                  );
                                } else if (key == 'actions' && hasPopUp) {
                                  return (
                                    <DataTableCell key={key} style={style}>
                                      <Link to={`/bids/${row.id}/overview`}>
                                        <Image src={edit} height={20} mr={2} />
                                      </Link>
                                      {/* <Image
                                        src={deleteIcon}
                                        onClick={() => {
                                          setId(row.id);
                                          setDeleteOpen(true);
                                        }}
                                        height={20}
                                        mr={4}
                                      /> */}
                                      {/* <ActionButton
                                    variant='outline'
                                    redirectPath={`/bids/${bid.id}/overview`}
                                    disabled={disabled}
                                    {...(disabled && { rippleColor: 'unset' })}
                                  >
                                    Edit
                                  </ActionButton> */}
                                    </DataTableCell>
                                  );
                                } else {
                                  return renderCell(row, key, style, hasAction ? isRestricted : undefined);
                                }
                              })}
                            </StyledDataTableRow>
                          ))}
                      </DataTableBody>
                    </DataTableContent>
                  </div>
                  {isLoading && <ProgressSpinner />}
                </StyledDataTable>
                <DataTableFooter>
                  {countData && !countError && (
                    <ListPagination
                      current={Number(page) + 1 || 1}
                      total={Math.ceil(countData / limit)}
                      limit={limit}
                      onPageChange={setNewPage}
                      onLimitChange={setNewLimit}
                      isLoading={isLoadingCount}
                    />
                  )}
                </DataTableFooter>
              </>
            ) : !isLoading ? (
              <CenteredContainer>
                <EmptyMessageTitle variant='subtitle' mb={4}>
                  You don’t have any existing bids
                </EmptyMessageTitle>
                <StyledButton variant='primary' redirectPath='/bids/new/overview' disabled={isRestricted}>
                  Create a New Bid
                </StyledButton>
              </CenteredContainer>
            ) : (
              <ProgressSpinner />
            )}
          </StyledCard>
        </Box>
      </Layout>

      {/*BID MODAL */}
      <Dialog
        open={pdfModal}
        onClose={evt => {
          setPdfOpen(false);
          console.log(evt.detail.action);
        }}
        onClosed={evt => {
          setPdfOpen(false);
          console.log(evt.detail.action);
        }}
      >
        <DialogTitle>Email Bid</DialogTitle>
        <DialogContent>
          <TextField label='Label' type='text' value={Email} onChange={e => setEmail(e.target.value)} />
        </DialogContent>

        <DialogActions>
          <DialogButton action='close'>Cancel</DialogButton>
          <DialogButton action='accept' isDefaultAction onClick={() => sendMail()}>
            Send
          </DialogButton>
        </DialogActions>
      </Dialog>

      {/*PLAN MODAL */}
      <Dialog
        open={planModal}
        onClose={evt => {
          setPlanModal(false);
          console.log(evt.detail.action);
        }}
        onClosed={evt => {
          setPlanModal(false);
          console.log(evt.detail.action);
        }}
      >
        <DialogTitle>Email, link to plan</DialogTitle>
        <DialogContent>
          <TextField label='Label' type='text' value={Email} onChange={e => setEmail(e.target.value)} />
        </DialogContent>

        <DialogActions>
          <DialogButton action='close'>Cancel</DialogButton>
          <DialogButton action='accept' isDefaultAction onClick={() => sendPlan()}>
            Send
          </DialogButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={DeleteInsopen}
        onClose={evt => {
          console.log(evt.detail.action);
          setDeleteOpen(false);
        }}
        onClosed={evt => console.log(evt.detail.action)}
      >
        <DialogTitle>Are you sure</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <DialogButton action='close'>Cancel</DialogButton>
          <DialogButton action='accept' isDefaultAction onClick={() => deleteBid()}>
            Delete
          </DialogButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BidList;

const AddButton = styled(ButtonWithRipple)`
  width: 45px !important;
  display: flex;
  align-items: center;
  opacity: 0.5;
  justify-content: center;
  @media (max-width: 768px) {
    display: inline-block;
  }
`;
