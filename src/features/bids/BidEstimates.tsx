import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { DataTable, DataTableBody, DataTableContent, DataTableHead, DataTableHeadCell, DataTableRow } from '@rmwc/data-table';
import { Icon } from '@rmwc/icon';
import { TextFieldHTMLProps } from '@rmwc/textfield';
import Cookies, { CookieAttributes } from 'js-cookie';
import axios from 'axios';

import styled from '../../styled-components';
import { Layout, Text, ButtonWithRipple, Box, LoadedContainer, SectionBackButton, TextField, FormField } from '../../components';
import { BidNavProps } from '../../components/BidNavbar';
import { notifyBidSave } from './BidOverview';
import useBid from '../../lib/bid/useBid';
import { useCalculateEstimates, useGetBidById, useGetBidEstimates, useGetBidDetails } from '../../lib/api/Bid.hooks';
import { API_URL, getAccessToken } from '../../lib/api/Api';
import {
  BidSubmitAction,
  Division,
  DivisionDescriptions,
  DivisionNames,
  KeyInspectionDescriptions,
  KeyInspection,
  PlansUploaded
} from '../../constants/Bid';
import theme from '../../constants/Theme';
import { BidEstimatesColumns, BidEstimateRowData } from './BidTableColumns';
import { TextFieldProps } from '../../components/TextField';
import { trashIcon, trashAdd, trashEdit } from '../../assets/images';
import { BidDetailsSummary, BidOverviewSummary, BidPlansSummary } from './BidSummary';
import Defaults from '../../constants/Defaults';
import { DivisionValue } from '../../types';
import { formatPrice } from '../../lib/formatPrice';
import { DataTableCell, DataTableCellProps } from '@rmwc/data-table';

type EstimateSummary = {
  totalCost: string;
  costPerSq: string;
  daysToComplete: string;
  totalInspections: number;
  // estimatesData: any;
  keyInspections: { [key in KeyInspection]: number };
};

const SectionContainer = styled(LoadedContainer)`
  width: 85%;
  max-width: 1215px;
  z-index: 100;
`;

const StyledTextArea = styled(TextField)<TextFieldProps & TextFieldHTMLProps>`
  max-width: 492px;
  margin-bottom: 30px;
  &&& {
    textarea {
      height: 140px;
    }
    * {
      height: 140px;
      resize: none;
      line-height: 22px;
    }
  }
`;

const EstimateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 20px;
`;

const StyledDataTable = styled(DataTable)`
  width: 100%;
  border: none;
  border-bottom: 1px solid ${theme.gainsboro};
  background: none;
  margin-bottom: 40px;
`;

const StyledTableHead = styled(DataTableHead)`
  border-bottom: 3px solid ${theme.gainsboro};
  grid-template-columns: auto auto auto;
`;

const EstimateSummaryPanel = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 10px;
`;

const EstimateSummaryPanelGridTwo = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 10px;
`;

const BidSummaryPanel = styled.div`
  flex: 1;
  display: flex;
  column-gap: 30px;
  flex-wrap: wrap;
  align-self: start;
  margin-left: 20px;
`;

const BidEstimates = (props: RouteComponentProps<{ bid?: string }>) => {
  const bidId = Number(props.match.params.bid) || 0;
  const previousPage = `/bids/${bidId}/details`;
  const nextPage = `/bids/${bidId}/pricing`;
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowPlus, setShowPlus] = useState(true);
  const [submitAction, setSubmitAction] = useState<BidSubmitAction | null>();
  const [estimates, setEstimates] = useState<BidEstimateRowData[]>([]);
  const [estimateSummary, setEstimateSummary] = useState<EstimateSummary>({} as EstimateSummary);
  const [, setBid] = useBid();

  const [Email, setEmail] = useState('');

  const calculateEstimate = useCalculateEstimates(bidId);
  const { get: fetchBidById, ...getBidById } = useGetBidById(bidId);
  const { get: fetchBidDetails, ...getBidDetails } = useGetBidDetails(bidId);
  const { get: fetchBidEstimates, ...getBidEstimates } = useGetBidEstimates(bidId);

  const bidNav: BidNavProps = {
    bidId,
    isSubmitting,
    onPreviousPage: () => history.push(previousPage),
    onNextPage: () => history.push(nextPage),

    onSave: async () => {
      await handleSave();
      setSubmitAction(BidSubmitAction.SAVE);
    },
    onSaveAndClose: async () => {
      await handleSave();
      setSubmitAction(BidSubmitAction.CLOSE);
    }
  };

  useEffect(() => {
    if (bidId) {
      fetchBidById();
      fetchBidDetails();
      fetchBidEstimates();
    } else {
      history.push('/bids');
    }
  }, [fetchBidById, fetchBidDetails, fetchBidEstimates, bidId, history]);

  useEffect(() => {
    if (
      getBidById.data &&
      !getBidById.error &&
      !getBidDetails.error &&
      !getBidDetails.isLoading &&
      !getBidEstimates.error &&
      !getBidEstimates.isLoading
    ) {
      const { id, plansUploaded } = getBidById.data;
      const descriptions = DivisionDescriptions(getBidById.data);

      if (getBidDetails.data && getBidEstimates.data) {
        const { divisions = {}, profitMargin, inspections, totalCost, daysToComplete, costPerSq } = getBidEstimates.data;

        const estimates: BidEstimateRowData[] = Object.values(Division).map(key => {
          const div = key as Division;
          const divEstimate = (divisions as DivisionValue)[div];
          const divEstimateFormatted = divEstimate === null || divEstimate === undefined ? '-' : formatPrice(divEstimate);
          return {
            division: DivisionNames[div],
            description: descriptions[div],
            cost: divEstimateFormatted
          };
        });
        estimates.push({
          division: '',
          description: 'Profit/Margin',
          cost: formatPrice(profitMargin)
          //crud: ''
        });
        setEstimates(estimates);

        {
          localStorage.setItem('estimatesData', JSON.stringify(estimates));
        }

        const estimateSummary = inspections
          ? {
              totalCost: `$ ${formatPrice(totalCost)}`,
              costPerSq: `$ ${formatPrice(costPerSq)}`,
              daysToComplete: `${daysToComplete} calendar days`,
              totalInspections: inspections.totalInspections,
              keyInspections: {
                [KeyInspection.ROUGH_INSPECTION]: inspections.roughInspections,
                [KeyInspection.FINAL_INSPECTION]: inspections.finalInspections,
                [KeyInspection.GREASE_DUCT_INSPECTION]: inspections.greaseDuctInspections,
                [KeyInspection.PRE_HEALTH_INSPECTION]: inspections.preHealthInspections,
                [KeyInspection.FINAL_HEALTH_INSPECTION]: inspections.finalHealthInspections,
                [KeyInspection.FINAL_BLDG_INSPECTION]: inspections.finalBldgInspections,
                [KeyInspection.FIRE_DEPT_INSPECTION]: inspections.fireDeptInspections
              }
            }
          : ({} as EstimateSummary);
        setEstimateSummary(estimateSummary);
        localStorage.setItem('estimateSummaryData', JSON.stringify(estimateSummary));
        setBid({ hasPlans: plansUploaded, hasEstimate: true, hasUploadedPlans: plansUploaded === PlansUploaded.UPLOADED });
        setIsLoading(false);
      } else {
        history.push(`/bids/${id}/overview`);
      }
    }
    if (getBidById.error || getBidDetails.error || getBidEstimates.error) {
      history.push('/bids');
    }
  }, [
    history,
    setBid,
    setEstimates,
    setEstimateSummary,
    getBidById.data,
    getBidById.error,
    getBidDetails.data,
    getBidDetails.error,
    getBidDetails.isLoading,
    getBidEstimates.data,
    getBidEstimates.error,
    getBidEstimates.isLoading
  ]);

  useEffect(() => {
    if (submitAction && calculateEstimate.data && !calculateEstimate.error && !calculateEstimate.isLoading) {
      notifyBidSave();
      switch (submitAction) {
        case BidSubmitAction.CLOSE:
          history.push('/bids');
          break;
        case BidSubmitAction.CREATE_NEW:
          history.push('/bids/new/overview');
          break;
      }
    }
  }, [submitAction, history, calculateEstimate.data, calculateEstimate.error, calculateEstimate.isLoading]);

  const handleSave = async () => {
    setSubmitAction(null);
    setIsSubmitting(true);
    await calculateEstimate.mutate();
    setIsSubmitting(false);
  };

  const hadnleDownload = () => {
    const token = Cookies.get(Defaults.ACCESS_TOKEN_COOKIE_KEY);
    const body = {
      divisions: estimatesData,
      inspections: estimateSummaryData.keyInspections,
      exclusions: [exclusions]
    };
    const header = `Bearer ${token}`;

    axios
      .post(`${API_URL}bids/${bidId}/dynamic-export-estimate`, body, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf'
        },
        responseType: 'blob'
      })
      .then(response => {
        var blob = new Blob([response.data], { type: 'application/pdf' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Bidvita-estimate';
        link.click();
      })
      .catch(error => {});
  };

  const sendMail = () => {
    const token = Cookies.get(Defaults.ACCESS_TOKEN_COOKIE_KEY);
    const body = {
      divisions: estimatesData,
      inspections: estimateSummaryData.keyInspections,
      exclusions: [exclusions],
      email: Email
    };
    const header = `Bearer ${token}`;

    axios
      .post(`${API_URL}bids/${bidId}/email-estimate`, body)
      .then(response => {})
      .catch(error => {});
  };

  const estimatesData = JSON.parse(localStorage.getItem('estimatesData') || '{}');
  const estimateSummaryData = JSON.parse(localStorage.getItem('estimateSummaryData') || '{}');
  const exclusions = JSON.parse(localStorage.getItem('exclusions') || '{}');
  return (
    <Layout bidNav={bidNav} hidePatternFooter>
      <SectionContainer my={10} isLoading={isLoading}>
        <Box marginLeft='auto' display='table' marginRight='auto' overflowY='auto'>
          <Box>
            <SectionBackButton to={previousPage} />
            <Text variant='title' mb={40}>
              Bid
            </Text>

            <EstimateContainer>
              <Box flex={2} width='100%'>
                <StyledDataTable>
                  <DataTableContent>
                    <StyledTableHead>
                      <DataTableRow>
                        {BidEstimatesColumns.map(({ key, title, headerStyle }) => {
                          return (
                            <DataTableHeadCell key={key} style={headerStyle}>
                              <Text variant='label'>{title}</Text>
                            </DataTableHeadCell>
                          );
                        })}
                      </DataTableRow>
                    </StyledTableHead>

                    <DataTableBody>
                      {estimates &&
                        estimates.length > 0 &&
                        estimates.map((row, i) => (
                          <DataTableRow key={i}>
                            {BidEstimatesColumns.map(({ key, renderCell, style }) => {
                              if (key == 'description') {
                                return (
                                  <DataTableCell key={key} style={style}>
                                    <Box display='flex' alignItems='center' style={{ justifyContent: 'space-between' }}>
                                      {isShowPlus && (
                                        <Text variant='tableBody'>{`${(row as Record<string, any>)[key].substring(0, 50) || ''}`}</Text>
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
                                  </DataTableCell>
                                );
                              } else {
                                return renderCell(row, key, style);
                              }
                            })}
                          </DataTableRow>
                        ))}
                    </DataTableBody>
                  </DataTableContent>
                </StyledDataTable>

                <EstimateSummaryPanelGridTwo>
                  <Text textAlign='left' fontWeight={700}></Text>
                  <Text marginRight={200} textAlign='left' fontWeight={700} mb={24}>
                    Project Cost Total
                  </Text>
                  <Text textAlign='right' fontWeight={700}>
                    {estimateSummary.totalCost}
                  </Text>

                  <Text textAlign='right' fontWeight={700}></Text>
                  <Text marginRight={200} textAlign='left' fontWeight={700} mb={44}>
                    Cost per Sq. Ft.
                  </Text>
                  <Text textAlign='right' fontWeight={700}>
                    {estimateSummary.costPerSq}
                  </Text>
                </EstimateSummaryPanelGridTwo>

                <Box display='flex' mb={130} flex={1} width='100%'>
                  <EstimateSummaryPanel>
                    <Text fontWeight={700} mb={24}>
                      Number of days to complete the project
                    </Text>
                    <Text fontWeight={700} mb={24}>
                      {estimateSummary.daysToComplete}
                    </Text>
                    <Text fontWeight={700} textAlign='end'></Text>

                    <Text fontWeight={700} mb={24}>
                      Total Inspections
                    </Text>
                    <Text fontWeight={700}>{estimateSummary.totalInspections}</Text>
                    <Text fontWeight={700} textAlign='end'></Text>

                    {!!estimateSummary.keyInspections &&
                      Object.entries(estimateSummary.keyInspections).map(([key, value]) => {
                        return (
                          !!value && (
                            <React.Fragment key={key}>
                              <Text>{KeyInspectionDescriptions[key as KeyInspection]}</Text>
                              {value}
                              <Text fontWeight={700} textAlign='end'></Text>
                            </React.Fragment>
                          )
                        );
                      })}
                  </EstimateSummaryPanel>

                  {/* <BidSummaryPanel> */}
                  {/* <Box flex={1}>
              {getBidById.data && <BidOverviewSummary bid={getBidById.data} />}
              {getBidById.data && <BidPlansSummary bid={getBidById.data} />}
            </Box> */}
                  {/* {getBidDetails.data && <BidDetailsSummary details={getBidDetails.data} />} */}
                  {/* </BidSummaryPanel> */}
                </Box>
              </Box>
            </EstimateContainer>
          </Box>
        </Box>
      </SectionContainer>
    </Layout>
  );
};

export default withRouter(BidEstimates);

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
