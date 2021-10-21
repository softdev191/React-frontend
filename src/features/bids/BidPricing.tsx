import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableContent,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow
} from '@rmwc/data-table';

import theme from '../../constants/Theme';
import styled from '../../styled-components';
import { Layout, Box, Text, ButtonWithRipple, Image, LoadedContainer, SectionBackButton } from '../../components';
import { BidCostColumns, BidScheduleColumns, BidCostRowData, BidScheduleRowData } from './BidTableColumns';
import { BidNavProps } from '../../components/BidNavbar';
import { priceRangeGraph } from '../../assets/images';
import { notifyBidSave, StyledRadio, CustomErrorText } from './BidOverview';
import useBid from '../../lib/bid/useBid';
import { useGetBidById, useGetBidEstimates, useGetBidPricing, useCalculateEstimates, useUpdateBidPricing } from '../../lib/api/Bid.hooks';
import { formatPrice } from '../../lib/formatPrice';
import {
  Pricing,
  PricingCostLabels,
  PricingScheduleLabels,
  BidSubmitAction,
  BidPricingSelection,
  PlansUploaded
} from '../../constants/Bid';
import { API_URL, getAccessToken } from '../../lib/api/Api';

type ProjectCost = {
  belowCost: string;
  greatCost: string;
  goodCost: string;
  aboveMarket: string;
};

const SectionContainer = styled(LoadedContainer)`
  width: 85%;
  max-width: 1215px;
  z-index: 100;
`;

const StyledDataTable = styled(DataTable)`
  margin-bottom: 40px;
`;

const StyledTableHead = styled(DataTableHead)`
  border-bottom: 3px solid ${theme.gainsboro};
`;

const PriceRangeContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  column-gap: 5px;
  margin-bottom: 30px;
  overflow-x: auto;
`;

const CostContainer = styled(Box)`
  display: flex;
  flex: auto;
  @media (max-width: 768px) {
    display: block !important;
    flex: none;
  }
`;

const PriceRange = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  border-radius: 6px;
  width: 160px;
  height: 80px;
  padding: 10px;
  p {
    color: white;
  }
`;

const PriceLabel = styled(Text)`
  font-weight: 700;
`;

const PriceValue = styled(Text)`
  font-weight: 400;
  white-space: nowrap;
`;

const PricingFormSchema = Yup.object().shape({
  projectCost: Yup.string()
});

type PricingFormType = {
  projectCost: BidPricingSelection;
};
const initialFormValues: PricingFormType = {
  projectCost: BidPricingSelection.NONE
};

const BidPricing = (props: RouteComponentProps<{ bid?: string }>) => {
  const bidId = Number(props.match.params.bid) || 0;
  const previousPage = `/bids/${bidId}/estimates`;

  const history = useHistory();
  const formRef = useRef<FormikProps<PricingFormType>>(null);

  const [initialValues, setInitialValues] = useState(initialFormValues);
  const [pricingCost, setPricingCost] = useState<BidCostRowData[]>([]);
  const [pricingSchedule, setPricingSchedule] = useState<BidScheduleRowData[]>([]);
  const [projectCost, setProjectCost] = useState<ProjectCost>({} as ProjectCost);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState<BidSubmitAction | null>();
  const [, setBid] = useBid();

  const calculateEstimate = useCalculateEstimates(bidId);
  const updateBidPricing = useUpdateBidPricing(bidId);
  const { get: fetchBidById, ...getBidById } = useGetBidById(bidId);
  const { get: fetchBidEstimates, ...getBidEstimates } = useGetBidEstimates(bidId);
  const { get: fetchBidPricing, ...getBidPricing } = useGetBidPricing(bidId);

  const bidNav: BidNavProps = {
    bidId,
    isSubmitting,
    onPreviousPage: () => {
      history.push(previousPage);
    },
    onNextPage: async () => {
      await formRef.current?.submitForm();
      setIsSubmitting(false);
      setSubmitAction(BidSubmitAction.NEXT);
    },
    onSave: async () => {
      await formRef.current?.submitForm();
      if (formRef.current?.isValid) {
        await calculateEstimate.mutate();
      }
      setIsSubmitting(false);
      setSubmitAction(BidSubmitAction.SAVE);
    },
    onSaveAndClose: async () => {
      await formRef.current?.submitForm();
      if (formRef.current?.isValid) {
        await calculateEstimate.mutate();
      }
      setIsSubmitting(false);
      setSubmitAction(BidSubmitAction.CLOSE);
    }
  };

  useEffect(() => {
    if (bidId) {
      fetchBidById();
      fetchBidEstimates();
      fetchBidPricing();
    } else {
      history.push('/bids');
    }
  }, [fetchBidById, fetchBidEstimates, fetchBidPricing, bidId, history]);

  useEffect(() => {
    if (
      getBidById.data &&
      !getBidById.error &&
      !getBidEstimates.error &&
      !getBidEstimates.isLoading &&
      !getBidPricing.error &&
      !getBidPricing.isLoading
    ) {
      const { id, plansUploaded } = getBidById.data;
      if (getBidEstimates.data && getBidPricing.data) {
        const { pricing, mediumCost, mediumSchedule, selected } = getBidPricing.data;
        const { lowCost, goodCost, highCost, lowSchedule, highSchedule } = pricing;

        const formValues: PricingFormType = {
          projectCost: selected
        };
        const pricingCost = [
          {
            ...PricingCostLabels[Pricing.LOW],
            projectCost: `$ ${formatPrice(lowCost)}`
          },
          {
            ...PricingCostLabels[Pricing.MEDIUM],
            projectCost: `$ ${formatPrice(mediumCost)}`
          },
          {
            ...PricingCostLabels[Pricing.HIGH],
            projectCost: `$ ${formatPrice(highCost)}`
          }
        ];
        const pricingSchedule = [
          {
            ...PricingScheduleLabels[Pricing.LOW],
            schedule: lowSchedule
          },
          {
            ...PricingScheduleLabels[Pricing.MEDIUM],
            schedule: mediumSchedule
          },
          {
            ...PricingScheduleLabels[Pricing.HIGH],
            schedule: highSchedule
          }
        ];
        const projectCost = {
          belowCost: `$ ${formatPrice(lowCost)}`,
          greatCost: `$ ${formatPrice(mediumCost)}`,
          goodCost: `$ ${formatPrice(goodCost)}`,
          aboveMarket: `$ ${formatPrice(highCost)}`
        };

        setInitialValues(formValues);
        setPricingCost(pricingCost);
        setPricingSchedule(pricingSchedule);
        setProjectCost(projectCost);

        setBid({
          hasPlans: plansUploaded,
          hasEstimate: !!getBidEstimates.data,
          hasUploadedPlans: plansUploaded === PlansUploaded.UPLOADED
        });
        setIsLoading(false);
      } else {
        history.push(`/bids/${id}/overview`);
      }
    }
    if (getBidById.error || getBidEstimates.error || getBidPricing.error) {
      history.push('/bids');
    }
  }, [
    history,
    setBid,
    getBidById.data,
    getBidById.error,
    getBidEstimates.data,
    getBidEstimates.error,
    getBidEstimates.isLoading,
    getBidPricing.data,
    getBidPricing.error,
    getBidPricing.isLoading
  ]);

  useEffect(() => {
    if (submitAction && getBidById.data && updateBidPricing.data && !updateBidPricing.error && !updateBidPricing.isLoading) {
      if (submitAction === BidSubmitAction.NEXT) {
        const { id } = getBidById.data;
        notifyBidSave();
        history.push(`/bids/${id}/bid-preview`);
      } else if (calculateEstimate.data && !calculateEstimate.error && !calculateEstimate.isLoading) {
        notifyBidSave();
        if (submitAction === BidSubmitAction.CLOSE) {
          history.push('/bids');
        }
      }
    }
  }, [
    submitAction,
    history,
    getBidById.data,
    updateBidPricing.data,
    updateBidPricing.error,
    updateBidPricing.isLoading,
    calculateEstimate.data,
    calculateEstimate.error,
    calculateEstimate.isLoading
  ]);

  const handleSubmit = async values => {
    console.log(values, 'valuesvaluesvaluesvalues');
    if (values.projectCost == 1) {
      localStorage.setItem('RANGE', 'LOW');
    }
    if (values.projectCost == 2) {
      localStorage.setItem('RANGE', 'MEDIUM');
    }
    if (values.projectCost == 3) {
      localStorage.setItem('RANGE', 'HIGH');
    }
    setSubmitAction(null);
    setIsSubmitting(true);

    await updateBidPricing.update({
      selected: +values.projectCost
    });
  };

  const handleDownload = async () => {
    await updateBidPricing.update({
      selected: Number(formRef.current?.values.projectCost)
    });
    let url = `${API_URL}bids/${bidId}/export-pricing?token=${getAccessToken()}`;
    window.open(url);
  };

  return (
    <Layout bidNav={bidNav} hidePatternFooter>
      <SectionContainer my={10} isLoading={isLoading}>
        <SectionBackButton to={previousPage} />
        <Text variant='title' mb={40}>
          Pricing
        </Text>
        <CostContainer>
          <Box maxWidth={750} mb={70} mx='auto'>
            <Image src={priceRangeGraph} maxHeight='400px' maxWidth='100%' mb={16} />
            <PriceRangeContainer>
              <PriceRange background={theme.milanoRed}>
                <PriceLabel>Below Cost</PriceLabel>
                <PriceValue>{projectCost.belowCost}</PriceValue>
              </PriceRange>
              <PriceRange background={theme.webOrange}>
                <PriceLabel>Great Cost</PriceLabel>
                <PriceValue>{projectCost.greatCost}</PriceValue>
              </PriceRange>
              <PriceRange background={theme.apple}>
                <PriceLabel>Good Cost</PriceLabel>
                <PriceValue>{projectCost.goodCost}</PriceValue>
              </PriceRange>
              <PriceRange background={theme.silverChalice}>
                <PriceLabel>Above Market</PriceLabel>
                <PriceValue>{projectCost.aboveMarket}</PriceValue>
              </PriceRange>
            </PriceRangeContainer>
          </Box>

          <Formik innerRef={formRef} initialValues={initialValues} validationSchema={PricingFormSchema} onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange }) => (
              <>
                {touched.projectCost && errors.projectCost && (
                  <CustomErrorText mb={2}>{touched.projectCost && errors.projectCost}</CustomErrorText>
                )}
                <Box display='flex' justifyContent='space-between' height='100%' mb={60}>
                  <StyledDataTable>
                    <DataTableContent>
                      <StyledTableHead>
                        <DataTableRow>
                          <DataTableHeadCell />
                          {BidCostColumns.map(({ key, title, headerStyle }) => {
                            return (
                              <DataTableHeadCell width={10} key={key} style={headerStyle}>
                                <Text variant='label'>{title}</Text>
                              </DataTableHeadCell>
                            );
                          })}
                        </DataTableRow>
                      </StyledTableHead>
                      <DataTableBody>
                        {pricingCost.map(row => (
                          <DataTableRow key={row.id}>
                            <DataTableCell width='5'>
                              <StyledRadio
                                name='projectCost'
                                onChange={handleChange}
                                value={row.id}
                                checked={String(values.projectCost) === String(row.id)}
                              />
                            </DataTableCell>
                            {BidCostColumns.map(({ key, renderCell, style }) => renderCell(row, key, style))}
                          </DataTableRow>
                        ))}
                      </DataTableBody>
                    </DataTableContent>
                  </StyledDataTable>
                </Box>
              </>
            )}
          </Formik>
        </CostContainer>
      </SectionContainer>
    </Layout>
  );
};

export default withRouter(BidPricing);
