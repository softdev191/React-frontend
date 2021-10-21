import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { LinearProgress, LinearProgressProps } from '@rmwc/linear-progress';

import theme from '../../constants/Theme';
import styled from '../../styled-components';
import { Layout, Box, Text, Image, Video, LoadedContainer, CenteredContainer, SectionBackButton } from '../../components';
import { BidOverviewSummary, BidPlansSummary } from './BidSummary';
import { BidNavProps } from '../../components/BidNavbar';
import { frame1_img, frame2_img, frame3_img, frame4_img, frame5_img, frame6_img, frame7_img, frame8_img } from '../../assets/images/';
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';

import {
  notifyBidSave,
  CustomErrorText,
  StyledForm,
  StyledFormField,
  StyledTextField,
  RadioGroup,
  TopDownRadioGroup,
  QuestionText,
  StyledRadio,
  scrollToField
} from './BidOverview';
import { ErrorMessages } from '../../constants/Strings';
import Defaults from '../../constants/Defaults';
import useBid from '../../lib/bid/useBid';
import {
  AcHvacUnits,
  AcHvacUnitsChoices,
  BidSubmitAction,
  BuildingType,
  BuildingTypes,
  FinishesType,
  FinishesTypes,
  FloorLevel,
  FloorLevels,
  ProfitMargin,
  ProfitMargins,
  SINGLE_FLOOR_BLDGS,
  ConstructionType,
  ConstructionTypes,
  StoreInfoType,
  StoreInfoTypes,
  Workscope,
  WorkscopeNames,
  PlansUploaded
} from '../../constants/Bid';
import { useGetBidById, useGetBidDetails, useGetBidEstimates, useUpsertBidDetails, useCalculateEstimates } from '../../lib/api/Bid.hooks';

const SectionContainer = styled(LoadedContainer)`
  width: 100%;
  z-index: 100;
  max-width: 1215px;
  @media (max-width: 768px) {
    margin-top: 80px;
    margin-left: 124px;
    margin-bottom: 10px;
    margin-right: 84px;
  }
`;

export const FrameText = styled(Text)`
  text-align: center;
  font-size: 2em;
  font-weight: 400;
`;

const FormFieldGroup = styled(Box)`
  max-width: 600px;
  margin-bottom: 50px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const FormFieldGroupMarginRight = styled(Box)`
  max-width: 600px;
  margin-right: -170px !important;
  margin-bottom: 50px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
    margin-right: -17px !important;
  }
`;

const FormFieldGroupMinWidth400 = styled(Box)`
  min-width: 400px;
  margin-bottom: 50px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const FormFieldGroupMinWidthWithMarginRight = styled(Box)`
  min-width: 400px;
  margin-right: -104px !important;
  margin-bottom: 50px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const FormFieldGroupMinWidth600 = styled(Box)`
  min-width: 600px;
  margin-bottom: 50px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const FormFieldGroupMinWidth200 = styled(Box)`
  width: 200px;
  margin-bottom: 50px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const FinishesContainer = styled.div`
  display: flex;
  margin-right: -472px !important;
  justify-content: space-between;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const FinishImageContainer = styled.div`
  width: 100%;
  height: 210px;
  border-radius: 8px;
  margin-bottom: 28px;
  overflow: hidden;
`;

const ProgressContainer = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  column-gap: 10px;
`;

const ProgressBar = styled(LinearProgress)<LinearProgressProps>`
  height: 16px;
  border-radius: 10px;
  border: 1px solid ${theme.gainsboro};

  .mdc-linear-progress__bar-inner {
    border-top-width: 16px;
  }
  .mdc-linear-progress__buffering-dots {
    display: none;
  }
`;

const SiteInfoContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap-reverse;
  column-gap: 20px;
`;

const BidSummaryPanel = styled.div`
  flex: 1;
  display: flex;
  column-gap: 30px;
  flex-wrap: wrap;
  align-self: end;
  justify-content: flex-end;
  margin-right: -65px !important;
`;

// const BidSummaryPanel = styled.div`
//   position: absolute;
//   display: flex;
//   flex-direction: column;
//   top: 10px;
//   right: 0;
//   z-index: 999;
// `;

const TWO_COLUMNS = 2;
const DISABLED_WORKSCOPE_OPTIONS = [String(Workscope.GROUND_UP)];

export type DetailFormType = {
  workscope?: Workscope;
  constructionType?: ConstructionType;
  buildingType?: BuildingType;
  floor?: FloorLevel;
  storefront?: StoreInfoType;
  acHvacUnits?: AcHvacUnits;
  squareFoot: number | string;
  finishes?: FinishesType;
  profitMargin?: ProfitMargin;
};
const initialFormValues: DetailFormType = {
  workscope: undefined,
  constructionType: undefined,
  buildingType: undefined,
  floor: undefined,
  storefront: undefined,
  acHvacUnits: undefined,
  squareFoot: '',
  finishes: undefined,
  profitMargin: undefined
};
const DetailsFormSchema = Yup.object().shape({
  workscope: Yup.string()
    .required(ErrorMessages.REQUIRED)
    .notOneOf(DISABLED_WORKSCOPE_OPTIONS, ErrorMessages.UNDER_CONSTRUCTION),
  constructionType: Yup.string().required(ErrorMessages.REQUIRED),
  buildingType: Yup.string().required(ErrorMessages.REQUIRED),
  floor: Yup.string().required(ErrorMessages.REQUIRED),
  storefront: Yup.string().required(ErrorMessages.REQUIRED),
  acHvacUnits: Yup.string().required(ErrorMessages.REQUIRED),
  squareFoot: Yup.number()
    .required(ErrorMessages.REQUIRED)
    .min(Defaults.MINIMUM_SQUARE_FEET, `Square Feet must be at least ${Defaults.MINIMUM_SQUARE_FEET}`)
    .max(Defaults.MAXIMUM_SQUARE_FEET, `Square Feet must be at most ${Defaults.MAXIMUM_SQUARE_FEET}`),
  finishes: Yup.string().required(ErrorMessages.REQUIRED),
  profitMargin: Yup.string().required(ErrorMessages.REQUIRED)
});

const BidDetails = (props: RouteComponentProps<{ bid?: string }>) => {
  const bidId = Number(props.match.params.bid) || 0;

  const history = useHistory();
  const formRef = useRef<FormikProps<DetailFormType>>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [submitAction, setSubmitAction] = useState<BidSubmitAction | null>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [initialValues, setInitialValues] = useState(initialFormValues);
  const [bid, setBid] = useBid();

  const [interval, setInt] = useState(0);

  const [frame1, setFrame1] = useState(true);
  const [frame2, setFrame2] = useState(false);
  const [frame3, setFrame3] = useState(false);
  const [frame4, setFrame4] = useState(false);
  // const [frame5, setFrame5] = useState(false);
  // const [frame6, setFrame6] = useState(false);
  // const [frame7, setFrame7] = useState(false);
  // const [frame8, setFrame8] = useState(false);

  const upsertDetails = useUpsertBidDetails(bidId);
  const calculateEstimate = useCalculateEstimates(bidId);
  const { get: fetchBidById, ...getBidById } = useGetBidById(bidId);
  const { get: fetchBidDetails, ...getBidDetails } = useGetBidDetails(bidId);
  const { get: fetchBidEstimates, ...getBidEstimates } = useGetBidEstimates(bidId);

  let tempProgress = 0;

  const bidNav: BidNavProps = {
    bidId,
    isSubmitting,
    onPreviousPage: () => {
      history.push(getPreviousPage());
    },
    onNextPage: async () => {
      clearProgress();
      setShowProgress(true);

      await formRef.current?.submitForm();

      if (formRef.current?.isValid) {
        makeProgress(50);
        await calculateEstimate.mutate();
        makeProgress(100);
      } else {
        setIsSubmitting(false);
        setShowProgress(false);
        scrollToInvalidField();
      }
    },
    onSave: async () => {
      await formRef.current?.submitForm();
      scrollToInvalidField();

      if (formRef.current?.isValid) {
        await calculateEstimate.mutate();
        setSubmitAction(BidSubmitAction.SAVE);
      }
      setIsSubmitting(false);
    },
    onSaveAndClose: async () => {
      await formRef.current?.submitForm();
      scrollToInvalidField();

      if (formRef.current?.isValid) {
        await calculateEstimate.mutate();
        setSubmitAction(BidSubmitAction.CLOSE);
      }
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (progress <= 15) {
      setFrame1(true);
    } else if (progress > 20 && progress <= 60) {
      setFrame1(false);
      setFrame2(true);
    } else if (progress > 60 && progress <= 84) {
      setFrame2(false);
      setFrame3(true);
    } else if (progress > 84 && progress <= 100) {
      setFrame3(false);
      setFrame4(true);
    } else if (progress === 100) {
      setShowProgress(false);
    }
  }, [progress]);

  const makeProgress = (limit: number) => {
    // if(frame1){
    //   setProgress(prevProgress => prevProgress + 1);
    // setTimeout(() => makeProgress(limit), 1200);

    // }

    setProgress(prevProgress => prevProgress + 1);
    setTimeout(() => makeProgress(limit), 1200);
  };

  const clearProgress = () => {
    tempProgress = 0;
    setProgress(0);
  };

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitAction(BidSubmitAction.NEXT);
        setShowProgress(false);
      }, 500);
    }
  }, [progress, setSubmitAction, setIsSubmitting]);

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
      const { plansUploaded } = getBidById.data;
      setBid({
        hasPlans: plansUploaded,
        hasEstimate: !!getBidEstimates.data,
        hasUploadedPlans: plansUploaded === PlansUploaded.UPLOADED
      });

      if (getBidDetails.data) {
        const {
          workscope,
          constructionType,
          buildingType,
          floor,
          storefront,
          acHvacUnits,
          squareFoot,
          finishes,
          profitMargin
        } = getBidDetails.data;

        const formValues: DetailFormType = {
          workscope: workscope === null ? Workscope.DONT_KNOW : workscope,
          constructionType: constructionType === null ? ConstructionType.DONT_KNOW : constructionType,
          buildingType: buildingType === null ? BuildingType.DONT_KNOW : buildingType,
          floor: floor === null ? FloorLevel.DONT_KNOW : floor,
          storefront: storefront === null ? StoreInfoType.DONT_KNOW : storefront,
          acHvacUnits: acHvacUnits === null ? AcHvacUnits.DONT_KNOW : acHvacUnits,
          squareFoot,
          finishes,
          profitMargin
        };
        setInitialValues(formValues);
      }
      setIsLoading(false);
    }
    if (getBidById.error || getBidDetails.error || getBidEstimates.error) {
      history.push('/bids');
    }
  }, [
    history,
    setBid,
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
    if (
      submitAction &&
      getBidById.data &&
      upsertDetails.data &&
      !upsertDetails.error &&
      !upsertDetails.isLoading &&
      calculateEstimate.data &&
      !calculateEstimate.error &&
      !calculateEstimate.isLoading
    ) {
      const { id, plansUploaded } = getBidById.data;
      setBid({ hasPlans: plansUploaded, hasEstimate: true, hasUploadedPlans: plansUploaded === PlansUploaded.UPLOADED });

      switch (submitAction) {
        case BidSubmitAction.SAVE:
          notifyBidSave();
          break;
        case BidSubmitAction.NEXT:
          notifyBidSave();
          history.push(`/bids/${id}/estimates`);
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
    upsertDetails.data,
    upsertDetails.error,
    upsertDetails.isLoading,
    calculateEstimate.data,
    calculateEstimate.error,
    calculateEstimate.isLoading,
    getBidById.data
  ]);

  const scrollToInvalidField = () => {
    const { errors } = formRef.current || {};
    if (errors) {
      const firstErrorKey = Object.keys(errors)[0];
      const target = window.document.getElementsByName(firstErrorKey);
      if (target.length) {
        const offset = firstErrorKey === 'finishes' ? 340 : undefined;
        scrollToField(target[0], offset);
      }
    }
  };

  const handleSubmit = async (values: DetailFormType) => {
    setSubmitAction(null);
    setIsSubmitting(true);

    const { squareFoot, profitMargin, workscope, constructionType, buildingType, floor, storefront, acHvacUnits, finishes } = values;
    await upsertDetails.upsert({
      squareFoot: +squareFoot,
      profitMargin: profitMargin!,
      workscope: workscope === Workscope.DONT_KNOW ? null : +workscope!,
      constructionType: constructionType === ConstructionType.DONT_KNOW ? null : +constructionType!,
      buildingType: buildingType === BuildingType.DONT_KNOW ? null : +buildingType!,
      floor: floor === FloorLevel.DONT_KNOW ? null : +floor!,
      storefront: storefront === StoreInfoType.DONT_KNOW ? null : storefront!,
      acHvacUnits: acHvacUnits === AcHvacUnits.DONT_KNOW ? null : acHvacUnits!,
      finishes: +finishes!
    });
  };

  const getPreviousPage = (): string => {
    const previousPage = bid && bid.hasPlans !== PlansUploaded.NO_UPLOAD ? '/plans' : '/overview';
    return `/bids/${bidId}${previousPage}`;
  };

  console.log(
    `progress .. ${progress}  | tempProgress .. ${tempProgress} | frame1 : ${frame1} | frame2: ${frame2} | frame3: ${frame3} | frame4: ${frame4}`
  );
  return (
    <Layout bidNav={bidNav} hidePatternFooter headerHidden={false} footerHidden={showProgress} hideSubscriptionAlert={showProgress}>
      {showProgress && (
        <CenteredContainer minWidth={250} width='50%' height='132vh !important'>
          {/* <ProgressContainer>
            <Text variant='label'>{progress}%</Text>
            <ProgressBar progress={progress / 100} />
            <Text variant='label'>100%</Text>
          </ProgressContainer> */}

          {frame1 && (
            <Bounce right>
              <div>
                <Image
                  src={require('../../assets/videos/frame1_vid.gif')}
                  height={300}
                  mt={20}
                  style={{ borderRadius: ' 50% 50% 50% 70%/50% 50% 70% 60%' }}
                />
                <FrameText
                  style={{
                    marginTop: '1.7777rem',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    fontSize: '4rem',
                    textTransform: 'uppercase',
                    lineHeight: '2.5rem'
                  }}
                  variant='label'
                >
                  Reviewing Your Project
                </FrameText>
              </div>
            </Bounce>
          )}
          {frame2 && (
            <Bounce right>
              <div>
                <Image src={require('../../assets/videos/frame2_vid.gif')} height={300} mt={20} />
                <FrameText
                  style={{
                    marginTop: '1.7777rem',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    fontSize: '4rem',
                    textTransform: 'uppercase',
                    lineHeight: '2.5rem'
                  }}
                  variant='label'
                >
                  Analyzing Your Project
                </FrameText>
              </div>
            </Bounce>
          )}
          {frame3 && (
            <Bounce right>
              <div>
                <Image
                  src={require('../../assets/videos/frame3_vid.gif')}
                  height={300}
                  mt={20}
                  style={{ borderRadius: ' 50% 50% 50% 70%/50% 50% 70% 60%' }}
                />
                <FrameText
                  style={{
                    marginTop: '1.7777rem',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    fontSize: '4rem',
                    textTransform: 'uppercase',
                    lineHeight: '2.5rem'
                  }}
                  variant='label'
                >
                  Estimating Your Project
                </FrameText>
              </div>
            </Bounce>
          )}
          {frame4 && (
            <Bounce right>
              <div>
                <Image
                  src={require('../../assets/videos/frame4_vid.gif')}
                  height={300}
                  mt={20}
                  style={{ borderRadius: ' 50% 50% 50% 70%/50% 50% 70% 60%' }}
                />
                <FrameText
                  style={{
                    marginTop: '1.7777rem',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    fontSize: '4rem',
                    textTransform: 'uppercase',
                    lineHeight: '2.5rem'
                  }}
                  variant='label'
                >
                  Generating Your Bid
                </FrameText>
              </div>
            </Bounce>
          )}

          {/*          
          {frame1 && (<Bounce right><div style={{width:"800px", height:"500px"}} ><Video src={frame1_vid}  /><FrameText  style={{marginTop:"5px", marginBottom: "5px"}} variant='label'>Reviewing Your Project</FrameText></div></Bounce>)}
          {frame2 && (<Bounce right><div style={{width:"800px", height:"500px"}}><Video src={frame2_vid}  /><FrameText style={{marginTop:"5px", marginBottom: "5px"}} variant='label'>Analyzing Your Project</FrameText></div></Bounce>)}
          {frame3 && (<Bounce right><div style={{width:"800px", height:"500px"}} ><Video src={frame3_vid}  /><FrameText style={{marginTop:"5px", marginBottom: "5px"}} variant='label'>Estimating Your Project</FrameText></div></Bounce>)}
          {frame4 && (<Bounce right><div style={{width:"800px", height:"500px"}} ><Video src={frame4_vid}  /><FrameText style={{marginTop:"5px", marginBottom: "5px"}} variant='label'>Generating Your Bid</FrameText></div></Bounce>)} */}

          {progress > 0 ? <Text variant='videotext'>{progress - 1}%</Text> : <Text variant='videotext'>{progress}%</Text>}
          {/* <Text variant='videotext'>{interval}%</Text> */}
        </CenteredContainer>
      )}

      <SectionContainer my={10} isLoading={isLoading} display={showProgress ? 'none' : 'unset'}>
        <Box display='flex'>
          <Box>
            <SectionBackButton to={getPreviousPage()} />
            <Text variant='title' mb={40}>
              Details
            </Text>

            <Formik
              innerRef={formRef}
              initialValues={initialValues}
              validationSchema={DetailsFormSchema}
              validateOnBlur={true}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
                <StyledForm>
                  <SiteInfoContainer>
                    <Box flex={2}>
                      <Text variant='sectionTitle' lineHeight={0.5} mb={24}>
                        Site Info
                      </Text>

                      <Box display='flex' justifyContent='space-between'>
                        <FormFieldGroup>
                          <Text variant='sectionSubtitle' mb={24}>
                            Work Scope
                          </Text>
                          <QuestionText mb={24}>What kind of project is it?</QuestionText>
                          <TopDownRadioGroup
                            rows={Math.ceil(Object.entries(WorkscopeNames).length / TWO_COLUMNS)}
                            gridTemplateColumns='50%'
                          >
                            {Object.entries(WorkscopeNames).map(([id, label]) => (
                              <div key={id}>
                                <StyledRadio name='workscope' onChange={handleChange} value={id} checked={String(values.workscope) === id}>
                                  <Text>{label}</Text>
                                </StyledRadio>
                                {String(values.workscope) === id &&
                                  DISABLED_WORKSCOPE_OPTIONS.includes(id) &&
                                  touched.workscope &&
                                  errors.workscope === ErrorMessages.UNDER_CONSTRUCTION && (
                                    <CustomErrorText style={{ position: 'relative', left: 10 }}>{errors.workscope}</CustomErrorText>
                                  )}
                              </div>
                            ))}
                          </TopDownRadioGroup>
                          {touched.workscope && errors.workscope && errors.workscope !== ErrorMessages.UNDER_CONSTRUCTION && (
                            <CustomErrorText>{errors.workscope}</CustomErrorText>
                          )}
                        </FormFieldGroup>

                        <FormFieldGroupMarginRight>
                          <Text variant='sectionSubtitle' mb={24}>
                            Construction Type
                          </Text>
                          <QuestionText mb={24}>Any interior demolition work?</QuestionText>
                          <RadioGroup>
                            {Object.entries(ConstructionTypes).map(([id, label]) => (
                              <StyledRadio
                                key={id}
                                name='constructionType'
                                onChange={handleChange}
                                value={id}
                                checked={String(values.constructionType) === id}
                              >
                                <Text>{label}</Text>
                              </StyledRadio>
                            ))}
                          </RadioGroup>
                          {touched.constructionType && errors.constructionType && (
                            <CustomErrorText>{errors.constructionType}</CustomErrorText>
                          )}
                        </FormFieldGroupMarginRight>
                      </Box>

                      <Box display='flex' justifyContent='space-between'>
                        <FormFieldGroup>
                          <Text variant='sectionSubtitle' mb={24}>
                            Building Type
                          </Text>
                          <QuestionText mb={24}>Where is this project located?</QuestionText>
                          <TopDownRadioGroup rows={Math.ceil(Object.entries(BuildingTypes).length / TWO_COLUMNS)} gridTemplateColumns='50%'>
                            {Object.entries(BuildingTypes).map(([id, label]) => (
                              <StyledRadio
                                key={id}
                                name='buildingType'
                                onChange={e => {
                                  handleChange(e);
                                  const { value: bldgId } = e.currentTarget;
                                  if (SINGLE_FLOOR_BLDGS.includes(String(bldgId))) {
                                    setFieldValue('floor', FloorLevel.FIRST_FLOOR);
                                  } else if (SINGLE_FLOOR_BLDGS.includes(String(values.buildingType))) {
                                    setFieldValue('floor', '');
                                  }
                                }}
                                value={id}
                                checked={String(values.buildingType) === id}
                              >
                                <Text>{label}</Text>
                              </StyledRadio>
                            ))}
                          </TopDownRadioGroup>
                          {touched.buildingType && errors.buildingType && <CustomErrorText>{errors.buildingType}</CustomErrorText>}
                        </FormFieldGroup>

                        <FormFieldGroupMarginRight
                          display={
                            SINGLE_FLOOR_BLDGS.includes(String(values.buildingType)) || values.buildingType === undefined ? 'none' : 'block'
                          }
                        >
                          <Text variant='sectionSubtitle' mb={24}>
                            Floor
                          </Text>
                          <QuestionText mb={24}>Which floor level is the project?</QuestionText>
                          <TopDownRadioGroup rows={Math.ceil(Object.entries(FloorLevels).length / TWO_COLUMNS)} gridTemplateColumns='50%'>
                            {Object.entries(FloorLevels).map(([id, label]) => (
                              <StyledRadio key={id} name='floor' onChange={handleChange} value={id} checked={String(values.floor) === id}>
                                <Text>{label}</Text>
                              </StyledRadio>
                            ))}
                          </TopDownRadioGroup>
                          {touched.floor && errors.floor && <CustomErrorText>{errors.floor}</CustomErrorText>}
                        </FormFieldGroupMarginRight>
                      </Box>
                      <div style={{ width: '113%' }}>
                        <Text variant='sectionTitle'>Store Info</Text>

                        <Box display='flex' justifyContent='space-between'>
                          <FormFieldGroupMinWidth400>
                            <Text variant='sectionSubtitle' mb={24}>
                              Storefront
                            </Text>
                            <QuestionText mb={24}>Information regarding Storefront.</QuestionText>
                            <TopDownRadioGroup
                              rows={Math.ceil(Object.entries(StoreInfoTypes).length / TWO_COLUMNS)}
                              gridTemplateColumns='50%'
                            >
                              {Object.entries(StoreInfoTypes).map(([id, label]) => (
                                <StyledRadio
                                  key={id}
                                  name='storefront'
                                  onChange={handleChange}
                                  value={id}
                                  checked={String(values.storefront) === id}
                                >
                                  <Text>{label}</Text>
                                </StyledRadio>
                              ))}
                            </TopDownRadioGroup>
                            {touched.storefront && errors.storefront && <CustomErrorText>{errors.storefront}</CustomErrorText>}
                          </FormFieldGroupMinWidth400>

                          {/* <FormFieldGroupMinWidthWithMarginRight
                          display={
                            SINGLE_FLOOR_BLDGS.includes(String(values.buildingType)) || values.buildingType === undefined ? 'none' : 'block'
                          }
                        > */}

                          <FormFieldGroupMinWidthWithMarginRight>
                            <Text variant='sectionSubtitle' mb={24}>
                              AC/HVAC Units
                            </Text>
                            <QuestionText mb={24}>Information regarding AC units</QuestionText>
                            <TopDownRadioGroup
                              rows={Math.ceil(Object.entries(AcHvacUnitsChoices).length / TWO_COLUMNS)}
                              gridTemplateColumns='50%'
                            >
                              {Object.entries(AcHvacUnitsChoices).map(([id, label]) => (
                                <StyledRadio
                                  key={id}
                                  name='acHvacUnits'
                                  onChange={handleChange}
                                  value={id}
                                  checked={String(values.acHvacUnits) === id}
                                >
                                  <Text>{label}</Text>
                                </StyledRadio>
                              ))}
                            </TopDownRadioGroup>
                            {touched.acHvacUnits && errors.acHvacUnits && (
                              <CustomErrorText>{touched.acHvacUnits && errors.acHvacUnits}</CustomErrorText>
                            )}
                          </FormFieldGroupMinWidthWithMarginRight>
                        </Box>
                      </div>
                    </Box>
                  </SiteInfoContainer>

                  <FormFieldGroupMinWidth200>
                    <StyledFormField label='Square Feet'>
                      <StyledTextField
                        outlined
                        type='number'
                        name='squareFoot'
                        placeholder={`(min: ${Defaults.MINIMUM_SQUARE_FEET}; max: ${Defaults.MAXIMUM_SQUARE_FEET})`}
                        onChange={(e: any) => {
                          setFieldTouched('squareFoot', true);
                          handleChange(e);
                        }}
                        value={values.squareFoot}
                        floatLabel={false}
                        helpText={
                          touched.squareFoot && errors.squareFoot
                            ? { persistent: true, validationMsg: true, children: touched.squareFoot && errors.squareFoot }
                            : null
                        }
                      />
                    </StyledFormField>
                  </FormFieldGroupMinWidth200>

                  <Text variant='sectionTitle'>Finishes</Text>
                  {touched.finishes && errors.finishes && <CustomErrorText mb={2}>{errors.finishes}</CustomErrorText>}

                  <FinishesContainer>
                    {Object.entries(FinishesTypes).map(([id, finishes]) => (
                      <Box width={368} mb={80} mr={2} key={id}>
                        <FinishImageContainer>
                          <Image src={finishes.image} width='100%' height='100%' objectFit='cover !important' />
                        </FinishImageContainer>
                        <Box position='relative' left={-10} mb={24}>
                          <StyledRadio name='finishes' onChange={handleChange} value={id} checked={String(values.finishes) === id}>
                            <Text variant='sectionSubtitle'>{finishes.title}</Text>
                          </StyledRadio>
                        </Box>
                        <QuestionText mx={34}>{finishes.description}</QuestionText>
                      </Box>
                    ))}
                  </FinishesContainer>

                  <Text variant='sectionTitle'>Profit Margin</Text>

                  <FormFieldGroup>
                    <QuestionText>What is your profit margin/over head?</QuestionText>
                    <TopDownRadioGroup rows={Math.ceil(Object.entries(ProfitMargins).length / TWO_COLUMNS)} gridTemplateColumns='50%'>
                      {Object.entries(ProfitMargins).map(([id, label]) => (
                        <StyledRadio
                          key={id}
                          name='profitMargin'
                          onChange={handleChange}
                          value={id}
                          checked={String(values.profitMargin) === id}
                        >
                          <Text>{label}</Text>
                        </StyledRadio>
                      ))}
                    </TopDownRadioGroup>
                    {touched.profitMargin && errors.profitMargin && <CustomErrorText>{errors.profitMargin}</CustomErrorText>}
                  </FormFieldGroup>

                  <br />
                  <br />
                  <br />
                </StyledForm>
              )}
            </Formik>
          </Box>
          {/* <BidSummaryPanel> */}
          {/* {getBidById.data && 
            <BidOverviewSummary bid={getBidById.data} />
            } */}
          {/* {getBidById.data && <BidPlansSummary bid={getBidById.data} />} */}
          {/* </BidSummaryPanel> */}
        </Box>
      </SectionContainer>
    </Layout>
  );
};

export default withRouter(BidDetails);
