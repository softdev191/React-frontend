import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Radio, RadioHTMLProps, RadioProps } from '@rmwc/radio';
import { FormattedOption, Select, SelectHTMLProps, SelectProps } from '@rmwc/select';
import { TextFieldHTMLProps } from '@rmwc/textfield';

import theme from '../../constants/Theme';
import styled from '../../styled-components';
import { Layout, Box, Text, TextField, FormField, TopDownGrid, CenteredContainer, LoadedContainer, TopDownGrid30 } from '../../components';
import { BidNavProps } from '../../components/BidNavbar';
import { TextFieldProps } from '../../components/TextField';
import WebSnackbarQueue from '../../lib/WebSnackbarQueue';
import { ErrorMessages, SuccessMessages } from '../../constants/Strings';
import {
  ProjectTypes,
  BusinessTypes,
  Region,
  Regions,
  BusinessType,
  ProjectType,
  BidSubmitAction,
  PlansUploadedLabels,
  PlansUploaded
} from '../../constants/Bid';
import { useGetBidById, useGetBidEstimates, useUpsertBid, useCalculateEstimates, useGetBidDetails } from '../../lib/api/Bid.hooks';
import { useGetStates } from '../../lib/api/State.hooks';
import useBid from '../../lib/bid/useBid';
import Defaults from '../../constants/Defaults';

const SectionContainer = styled(LoadedContainer)`
  width: 85%;
  max-width: 1215px;
  margin-top: 40px;
  @media (max-width: 768px) {
    margin-top: 80px;
    margin-bottom: 10px;
  }
  /* Landscape phones and down */
  @media (max-width: 480px) {
    p.sc-eCApGN.eoOPsl {
      font-size: 25px;
    }
    p.sc-eCApGN.fDVGOa {
      font-size: 29px;
    }
  }

  /* Landscape phone to portrait tablet */
  @media (max-width: 767px) {
    p.sc-eCApGN.eoOPsl {
      font-size: 25px;
    }
    p.sc-eCApGN.fDVGOa {
      font-size: 29px;
    }
  }
`;

const FormFieldGroup = styled(Box)`
  margin-bottom: 50px;
`;

const FormFieldGroupMb300 = styled(Box)`
  margin-bottom: 100px;
`;

const FormFieldGroupMarginBottomNone = styled(Box)`
  margin-bottom: 0px;
`;

const TextInputGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 26px;
  max-width: 388px;
`;

const StyledSelect = styled(Select)<SelectProps & SelectHTMLProps>`
  &&& {
    * {
      border-color: ${theme.alto};
    }
    .mdc-select__anchor {
      height: 44px;
      .mdc-select__selected-text {
        height: 100%;
        padding-top: 7px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
      .mdc-select__dropdown-icon {
        background: none;
        width: 0;
        height: 0;
        right: 10px;
        top: 18px;
        border-left: 5px solid #0000;
        border-right: 5px solid #0000;
        border-top: 5px solid ${theme.grey};
      }
    }
    &.mdc-select--focused .mdc-select__dropdown-icon {
      border-top: 5px solid ${theme.primary};
    }
  }
`;

export const StyledForm = styled.div`
  .mdc-text-field-helper-line {
    padding: 0;
  }
  &&&& {
    .mdc-select-helper-text,
    .mdc-text-field-helper-text {
      line-height: 1.45em;
      color: ${theme.inputInvalid};
    }
  }
`;

export const QuestionText = styled(Text)`
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
export const RadioGroup = styled(Box)`
  display: grid;
  grid-gap: 12px;
  position: relative;
  left: -10px;
  @media (max-width: 768px) {
    grid-gap: 0px;
    p {
      font-size: 14px;
    }
  }
`;

export const TopDownRadioGroup = styled(TopDownGrid)`
  grid-gap: 12px;
  padding-bottom: 50px;
  position: relative;
  left: -10px;
  @media (max-width: 768px) {
    grid-gap: 0px;
    p {
      font-size: 14px;
    }
  }
`;

export const TopDownRadioGroupPaddingBottom20 = styled(TopDownGrid30)`
  grid-gap: 12px;
  padding-bottom: 25px;
  position: relative;
  left: -10px;
  @media (max-width: 768px) {
    grid-gap: 0px;
    p {
      font-size: 14px;
    }
  }
`;

export const StyledRadio = styled(Radio)<RadioProps & RadioHTMLProps>`
  &&&&& {
    .mdc-radio__outer-circle {
      border-color: ${theme.alto};
    }
    .mdc-radio__inner-circle {
      border-color: ${theme.primary};
    }
    .mdc-radio__ripple {
      display: none;
    }
  }
`;

export const StyledFormField = styled(FormField)`
  p {
    color: ${theme.black};
    line-height: 30px;
  }
  sup {
    display: none;
  }
  @media (max-width: 768px) {
    p {
      font-size: 16px;
      line-height: 20px;
    }
  }
`;

export const StyledTextField = styled(TextField)<TextFieldProps & TextFieldHTMLProps>`
  max-width: 388px;
  margin-bottom: 5px;
  @media (max-width: 768px) {
    width: 250px;
  }
  &&& {
    * {
      border-color: ${theme.alto};
    }
  }
`;

export const StyledFileInput = styled.input`
  height: 0px;
`;

export const CustomErrorText = styled(Text)`
  color: ${theme.inputInvalid};
  font-size: 0.8em;
  font-weight: 400;
`;

export const notifyBidSave = () => {
  WebSnackbarQueue.notify({
    dismissesOnAction: true,
    title: SuccessMessages.PROJECT_SAVE_SUCCEEDED,
    actions: [
      {
        label: 'DISMISS'
      }
    ]
  });
};

export const scrollToField = (element: HTMLElement, offset = 120) => {
  let offsetTop = 0;
  while (element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent as HTMLElement;
  }

  window.scrollTo({ top: offsetTop - offset, behavior: 'smooth' });
};

const TWO_COLUMNS = 2;
const DISABLED_BUSINESS_TYPES = [String(BusinessType.SUBCON)];
const ZIPCODE_LENGTH = 5;

type OverviewFormType = {
  name: string;
  projectType?: ProjectType;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: number;
  zip: string;
  region: Region;
  businessType?: BusinessType;
  plansUploaded?: PlansUploaded;
};
const initialFormValues: OverviewFormType = {
  name: '',
  projectType: undefined,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: Defaults.STATE,
  zip: '',
  region: Region.NORTHERN_CALIFORNIA,
  businessType: undefined,
  plansUploaded: undefined
};
const OverviewFormSchema = Yup.object().shape({
  name: Yup.string().required(ErrorMessages.REQUIRED),
  projectType: Yup.string().required(ErrorMessages.REQUIRED),
  addressLine1: Yup.string().required(ErrorMessages.REQUIRED),
  addressLine2: Yup.string(),
  city: Yup.string().required(ErrorMessages.REQUIRED),
  state: Yup.number().required(ErrorMessages.REQUIRED),
  zip: Yup.string()
    .matches(/^[0-9]+$/, ErrorMessages.INVALID_ZIP)
    .length(ZIPCODE_LENGTH, ErrorMessages.INVALID_ZIP_LENGTH)
    .required(ErrorMessages.REQUIRED),
  region: Yup.string().required(ErrorMessages.REQUIRED),
  businessType: Yup.string()
    .required(ErrorMessages.REQUIRED)
    .notOneOf(DISABLED_BUSINESS_TYPES, ErrorMessages.UNDER_CONSTRUCTION),
  plansUploaded: Yup.string().required(ErrorMessages.REQUIRED)
});

const BidOverview = (props: RouteComponentProps<{ bid?: string }>) => {
  const bidId = Number(props.match.params.bid) || 0;

  const history = useHistory();
  const formRef = useRef<FormikProps<OverviewFormType>>(null);

  const [isLoading, setIsLoading] = useState(!!bidId);
  const [submitAction, setSubmitAction] = useState<BidSubmitAction | null>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [states, setStates] = useState<FormattedOption[] | {}>({});
  const [initialValues, setInitialValues] = useState(initialFormValues);
  const [, setBid] = useBid();

  const upsertBid = useUpsertBid(bidId);
  const calculateEstimate = useCalculateEstimates(bidId);
  const { get: fetchBidById, ...getBidById } = useGetBidById(bidId);
  const { get: fetchBidDetails, ...getBidDetails } = useGetBidDetails(bidId);
  const { get: fetchBidEstimates, ...getBidEstimates } = useGetBidEstimates(bidId);
  const { get: fetchStates, ...getStates } = useGetStates();

  const bidNav: BidNavProps = {
    bidId,
    isSubmitting,
    onNextPage: async () => {
      setIsSubmitting(true);
      await formRef.current?.submitForm();
      setIsSubmitting(false);
      scrollToInvalidField();
      setSubmitAction(BidSubmitAction.NEXT);
    },
    onSave: async () => {
      setIsSubmitting(true);
      await formRef.current?.submitForm();
      if (!!getBidDetails.data) {
        await calculateEstimate.mutate();
      }
      setIsSubmitting(false);
      scrollToInvalidField();
      setSubmitAction(BidSubmitAction.SAVE);
    },
    onSaveAndClose: async () => {
      setIsSubmitting(true);
      await formRef.current?.submitForm();
      if (!!getBidDetails.data) {
        await calculateEstimate.mutate();
      }
      setIsSubmitting(false);
      scrollToInvalidField();
      setSubmitAction(BidSubmitAction.CLOSE);
    }
  };

  useEffect(() => {
    if (bidId) {
      fetchBidById();
      fetchBidDetails();
      fetchBidEstimates();
    }
    fetchStates();
  }, [fetchBidById, fetchBidDetails, fetchBidEstimates, fetchStates, bidId]);

  useEffect(() => {
    if (getStates.data && !getStates.error) {
      const stateOptions = getStates.data.map(state => ({
        value: String(state.id),
        label: state.name
      }));
      setStates(stateOptions);
    }
  }, [setStates, getStates.data, getStates.error]);

  useEffect(() => {
    if (
      getBidById.data &&
      !getBidById.error &&
      !getBidDetails.error &&
      !getBidDetails.isLoading &&
      !getBidEstimates.error &&
      !getBidEstimates.isLoading
    ) {
      const { name, address, projectType, businessType, region, plansUploaded } = getBidById.data;
      const { addressLine1, addressLine2, city, zip } = address || {};

      const formValues: OverviewFormType = {
        ...initialFormValues,
        name,
        projectType,
        region: region === null ? Region.DONT_KNOW : +region,
        businessType: businessType === null ? BusinessType.DONT_KNOW : +businessType,
        plansUploaded: plansUploaded === PlansUploaded.UPLOADED ? PlansUploaded.WILL_UPLOAD : plansUploaded,
        ...(address && {
          addressLine1,
          addressLine2,
          city,
          zip
        })
      };
      setInitialValues(formValues);

      setBid({
        hasPlans: plansUploaded,
        hasEstimate: !!getBidEstimates.data,
        hasUploadedPlans: plansUploaded === PlansUploaded.UPLOADED
      });
      setIsLoading(false);
    }
    if (getBidById.error || getBidDetails.error || getBidEstimates.error) {
      history.push('/bids');
    }
  }, [
    history,
    setBid,
    setInitialValues,
    getBidById.data,
    getBidById.error,
    getBidDetails.error,
    getBidDetails.isLoading,
    getBidEstimates.data,
    getBidEstimates.error,
    getBidEstimates.isLoading
  ]);

  useEffect(() => {
    if (
      submitAction &&
      upsertBid.data &&
      !upsertBid.error &&
      !upsertBid.isLoading &&
      !calculateEstimate.error &&
      !calculateEstimate.isLoading
    ) {
      const { id, plansUploaded } = upsertBid.data;
      setBid({
        hasPlans: plansUploaded,
        hasEstimate: !!getBidEstimates.data,
        hasUploadedPlans: plansUploaded === PlansUploaded.UPLOADED
      });

      switch (submitAction) {
        case BidSubmitAction.SAVE:
          notifyBidSave();
          history.push(`/bids/${id}/overview`);
          break;
        case BidSubmitAction.NEXT:
          notifyBidSave();
          const nextPage = plansUploaded === PlansUploaded.NO_UPLOAD ? '/details' : '/plans';
          history.push(`/bids/${id}${nextPage}`);
          break;
        case BidSubmitAction.CLOSE:
          notifyBidSave();
          history.push('/bids');
          break;
      }
    }
  }, [
    submitAction,
    setBid,
    history,
    upsertBid.data,
    upsertBid.error,
    upsertBid.isLoading,
    calculateEstimate.error,
    calculateEstimate.isLoading,
    getBidEstimates.data
  ]);

  const scrollToInvalidField = () => {
    const { errors } = formRef.current || {};
    if (errors) {
      const firstErrorKey = Object.keys(errors)[0];
      const target = window.document.getElementsByName(firstErrorKey);
      if (target.length) {
        scrollToField(target[0]);
      }
    }
  };

  const handleSubmit = async (values: OverviewFormType) => {
    setSubmitAction(null);

    const { name, addressLine1, addressLine2, city, state, zip, projectType, businessType, region, plansUploaded } = values;
    const { plansUploaded: savedPlansUploaded } = getBidById.data || {};
    const isPlanUploaded = savedPlansUploaded === PlansUploaded.UPLOADED;
    const plansUploadedVal = +plansUploaded! === PlansUploaded.WILL_UPLOAD && isPlanUploaded ? PlansUploaded.UPLOADED : +plansUploaded!;

    await upsertBid.upsert({
      name,
      address: {
        addressLine1,
        addressLine2,
        city,
        stateId: +state!,
        zip
      },
      projectType: projectType!,
      businessType: businessType === BusinessType.DONT_KNOW ? null : +businessType!,
      region: region === Region.DONT_KNOW ? null : +region!,
      plansUploaded: plansUploadedVal
    });
  };

  return (
    <Layout bidNav={bidNav} hidePatternFooter>
      <SectionContainer my={6} isLoading={isLoading}>
        <Text variant='title' mb={40}>
          Overview
        </Text>
        <Text variant='sectionTitle' lineHeight={0.5} mb={24}>
          Project Info
        </Text>

        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={OverviewFormSchema}
          validateOnBlur={true}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
            <StyledForm>
              <FormFieldGroup>
                <StyledFormField label='Project Name'>
                  <StyledTextField
                    outlined
                    type='text'
                    name='name'
                    onChange={handleChange}
                    value={values.name}
                    floatLabel={false}
                    helpText={touched.name && errors.name ? { persistent: true, validationMsg: true, children: errors.name } : null}
                  />
                </StyledFormField>
              </FormFieldGroup>

              <FormFieldGroup>
                <Text variant='sectionSubtitle' mb={24}>
                  Project Type
                </Text>
                <QuestionText mb={24}>What kind of commercial project is it?</QuestionText>
                <RadioGroup gridTemplateColumns='repeat(auto-fill, 295px)'>
                  {Object.entries(ProjectTypes).map(([id, label]) => (
                    <StyledRadio key={id} name='projectType' onChange={handleChange} value={id} checked={String(values.projectType) === id}>
                      <Text>{label}</Text>
                    </StyledRadio>
                  ))}
                </RadioGroup>
                {touched.projectType && errors.projectType && <CustomErrorText>{errors.projectType}</CustomErrorText>}
              </FormFieldGroup>

              <Box display='flex' flexWrap='wrap'>
                <FormFieldGroup flex={1} maxWidth={'50%'}>
                  <Text variant='sectionSubtitle' mb={24}>
                    Address
                  </Text>

                  <StyledFormField label='Address Line 1'>
                    <StyledTextField
                      outlined
                      type='text'
                      name='addressLine1'
                      onChange={handleChange}
                      value={values.addressLine1}
                      floatLabel={false}
                      helpText={
                        touched.addressLine1 && errors.addressLine1
                          ? { persistent: true, validationMsg: true, children: errors.addressLine1 }
                          : null
                      }
                    />
                  </StyledFormField>

                  <StyledFormField label='Address Line 2'>
                    <StyledTextField
                      outlined
                      type='text'
                      name='addressLine2'
                      onChange={handleChange}
                      value={values.addressLine2}
                      floatLabel={false}
                      helpText={
                        touched.addressLine2 && errors.addressLine2
                          ? { persistent: true, validationMsg: true, children: errors.addressLine2 }
                          : null
                      }
                    />
                  </StyledFormField>

                  <StyledFormField label='City'>
                    <StyledTextField
                      outlined
                      type='text'
                      name='city'
                      onChange={handleChange}
                      value={values.city}
                      floatLabel={false}
                      helpText={touched.city && errors.city ? { persistent: true, validationMsg: true, children: errors.city } : null}
                    />
                  </StyledFormField>

                  <TextInputGroup>
                    <StyledFormField label='State'>
                      <StyledSelect
                        enhanced
                        outlined
                        rootProps={{ name: 'state' }}
                        onChange={e => setFieldValue('state', e.currentTarget.value)}
                        value={String(values.state)}
                        options={states}
                        helpText={touched.state && errors.state ? { persistent: true, validationMsg: true, children: errors.state } : null}
                        disabled
                      />
                    </StyledFormField>
                    <StyledFormField label='Zip Code'>
                      <StyledTextField
                        outlined
                        type='text'
                        name='zip'
                        onChange={(e: any) => {
                          setFieldTouched('zip', true);
                          handleChange(e);
                        }}
                        value={values.zip}
                        floatLabel={false}
                        helpText={touched.zip && errors.zip ? { persistent: true, validationMsg: true, children: errors.zip } : null}
                      />
                    </StyledFormField>
                  </TextInputGroup>
                </FormFieldGroup>

                <FormFieldGroup flex={1} maxWidth={'50%'}>
                  <Text variant='sectionSubtitle' mb={24}>
                    Region
                  </Text>
                  <RadioGroup>
                    {Object.entries(Regions).map(([id, label]) => (
                      <StyledRadio key={id} name='region' onChange={handleChange} value={id} checked={String(values.region) === id}>
                        <Text>{label}</Text>
                      </StyledRadio>
                    ))}
                  </RadioGroup>
                  {touched.region && errors.region && <CustomErrorText>{errors.region}</CustomErrorText>}
                </FormFieldGroup>
              </Box>
              <FormFieldGroupMarginBottomNone>
                <Text variant='sectionSubtitle' mb={24}>
                  Business Type
                </Text>
                <QuestionText mb={24}>Who are you?</QuestionText>
                <TopDownRadioGroupPaddingBottom20
                  rows={Math.ceil(Object.entries(BusinessTypes).length / TWO_COLUMNS)}
                  gridTemplateColumns='50%'
                >
                  {Object.entries(BusinessTypes).map(([id, label]) => (
                    <div key={id}>
                      <StyledRadio name='businessType' onChange={handleChange} value={id} checked={String(values.businessType) === id}>
                        <QuestionText>{label}</QuestionText>
                      </StyledRadio>
                      {String(values.businessType) === id &&
                        DISABLED_BUSINESS_TYPES.includes(id) &&
                        touched.businessType &&
                        errors.businessType === ErrorMessages.UNDER_CONSTRUCTION && (
                          <CustomErrorText style={{ position: 'relative', left: 10 }}>{errors.businessType}</CustomErrorText>
                        )}
                    </div>
                  ))}
                </TopDownRadioGroupPaddingBottom20>
                {touched.businessType && errors.businessType && errors.businessType !== ErrorMessages.UNDER_CONSTRUCTION && (
                  <CustomErrorText>{errors.businessType}</CustomErrorText>
                )}
              </FormFieldGroupMarginBottomNone>

              <FormFieldGroupMb300>
                <Text variant='sectionSubtitle' mb={24}>
                  Plans
                </Text>
                <QuestionText mb={24}>Do you have plans?</QuestionText>
                <RadioGroup gridTemplateColumns='repeat(auto-fill, 180px)'>
                  {Object.entries(PlansUploadedLabels)
                    .reverse()
                    .map(([id, label]) => (
                      <StyledRadio
                        key={id}
                        name='plansUploaded'
                        onChange={handleChange}
                        value={id}
                        checked={String(values.plansUploaded) === id}
                      >
                        <Text>{label}</Text>
                      </StyledRadio>
                    ))}
                </RadioGroup>
                {touched.plansUploaded && errors.plansUploaded && <CustomErrorText>{errors.plansUploaded}</CustomErrorText>}
              </FormFieldGroupMb300>
            </StyledForm>
          )}
        </Formik>
      </SectionContainer>
    </Layout>
  );
};

export default withRouter(BidOverview);
