import React, { useEffect, useRef, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { AsYouType } from 'libphonenumber-js';
import { Checkbox as RMWCCheckbox, CheckboxHTMLProps, CheckboxProps as RMWCCheckboxProps } from '@rmwc/checkbox';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { FormField, Image, Layout, TextField } from '../../components/';
import theme from '../../constants/Theme';
import { Box, Text } from '../../components';
import { homepageBG, homeSeparator, questions, magic, ready, checkMark } from '../../assets/images';
import Button, { ButtonProps } from '../../components/Button';
import { ErrorMessages } from '../../constants/Strings';
import useUser from '../../lib/user/useUser';
import styled from '../../styled-components';
import { SubscriptionPrices, SubscriptionType, TRIAL_DURATION_DAYS } from '../../constants/Subscription';
import Defaults from '../../constants/Defaults';
import WebSnackbarQueue from '../../lib/WebSnackbarQueue';

export const PRICING_HASH = '#pricing';
const { MONTHLY, ANNUAL, ONETIME } = SubscriptionType;

type SignUpFormProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};
const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required(ErrorMessages.REQUIRED_FIRST_NAME),
  lastName: Yup.string().required(ErrorMessages.REQUIRED_LAST_NAME),
  email: Yup.string()
    .email(ErrorMessages.INVALID_EMAIL)
    .required(ErrorMessages.REQUIRED_EMAIL),
  phone: Yup.string()
    .matches(Defaults.PHONE_REGEX, ErrorMessages.INVALID_PHONE)
    .required(ErrorMessages.REQUIRED_PHONE)
});

const userLoggedInMessage = () => {
  WebSnackbarQueue.notify({
    dismissesOnAction: true,
    title: ErrorMessages.ALREADY_LOGGED_IN,
    actions: [
      {
        label: 'DISMISS'
      }
    ]
  });
};

function Home() {
  const history = useHistory();
  const [user] = useUser();

  const pricingSection = useRef<HTMLDivElement>(null);
  const [tosChecked, setTosChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  useEffect(() => {
    if (window.location.hash === PRICING_HASH) {
      setTimeout(() => {
        const { offsetTop = 0 } = pricingSection.current || {};
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }, 100);
    }
  }, [history.location.key]);

  const isEmail = (value: string) => {
    const emailRegex = /^[+_a-z0-9-]+(\.[+_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (values: SignUpFormProps) =>
    !user
      ? history.push({
          pathname: '/register',
          state: { formValues: values }
        })
      : userLoggedInMessage();

  return (
    <Layout showHomePattern hideSubscriptionAlert>
      <StyledSignInContainer>
        <StyledImage src={homepageBG} />
        <StyledCard m={['50px auto', '50px auto', '50px 175px 35px 0']}>
          <Text variant='cardTitle' mt={30} mr={35} mb={10} ml={40}>
            {`Free ${TRIAL_DURATION_DAYS} day trial`}
          </Text>
          <Formik
            initialValues={{ firstName: '', lastName: '', email: '', phone: '' }}
            validationSchema={SignUpSchema}
            validateOnBlur={true}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <FormContainer>
                <Box variant='centeredRow'>
                  <FormField mr={15} label='First Name' validationMsg={touched.firstName && errors.firstName ? errors.firstName : ''}>
                    <StyledTextField
                      outlined
                      name='firstName'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName}
                      required={true}
                    />
                  </FormField>
                  <FormField label='Last Name' validationMsg={touched.lastName && errors.lastName ? errors.lastName : ''}>
                    <StyledTextField
                      outlined
                      name='lastName'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName}
                      required={true}
                    />
                  </FormField>
                </Box>
                <FormField label='Email' validationMsg={touched.email && errors.email ? errors.email : ''}>
                  <StyledTextField
                    outlined
                    type='email'
                    name='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    required={true}
                  />
                </FormField>
                <FormField label='Phone' validationMsg={touched.phone && errors.phone ? errors.phone : ''}>
                  <StyledTextField
                    outlined
                    type='phoneNumber'
                    name='phone'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    maxLength={14}
                    required={true}
                    onKeyUp={(e: any) => setFieldValue('phone', new AsYouType('US').input(e.target.value))}
                  />
                </FormField>
                <CheckboxContainer>
                  <StyledCheckbox checked={tosChecked} onChange={evt => setTosChecked(!!evt.currentTarget.checked)} />
                  <StyledTOCText>
                    {' '}
                    I agree to the BidVita
                    <a href='/terms-of-use'> Terms and Conditions</a>
                  </StyledTOCText>
                </CheckboxContainer>
                <BottomContainer>
                  <SignUpButton variant={tosChecked ? 'primary' : 'disabled'} type='submit' disabled={!tosChecked}>
                    Start Free Trial
                  </SignUpButton>
                </BottomContainer>
                <Text textAlign='center' variant='cardSubtitle' mt={0} mb={40}>
                  No credit card required.
                </Text>
              </FormContainer>
            )}
          </Formik>
        </StyledCard>
      </StyledSignInContainer>
      <StyledCardsContainer flexWrap={['wrap', 'wrap', 'nowrap']}>
        <StyledMiddleCards variant='centeredColumn'>
          <Image src={questions} />
          <StyledMiddleCardTitle>Answer Questions</StyledMiddleCardTitle>
          <StyledMiddleCardSubtitle>Generate 10x More Bids</StyledMiddleCardSubtitle>
        </StyledMiddleCards>
        <StyledMiddleCards variant='centeredColumn' mt={[0, 0, -40]}>
          <Image src={magic} />
          <StyledMiddleCardTitle>Let the Magic</StyledMiddleCardTitle>
          <StyledMiddleCardSubtitle>Win 10x More Projects</StyledMiddleCardSubtitle>
        </StyledMiddleCards>
        <StyledMiddleCards variant='centeredColumn'>
          <Image src={ready} />
          <StyledMiddleCardTitle>Bid Ready</StyledMiddleCardTitle>
          <StyledMiddleCardSubtitle>Generate bids in minutes. </StyledMiddleCardSubtitle>
        </StyledMiddleCards>
      </StyledCardsContainer>
      <StyledSubscriptionInfoContainer ref={pricingSection} variant='centeredRow' flexWrap={['wrap', 'wrap', 'nowrap']}>
        <Box variant='centeredColumn' width={400} mt={[0, 0, 50]}>
          <Box variant='centeredRow' alignItems='baseline' flexWrap='wrap' justifyContent='center' mb={12}>
            <Text fontFamily='Nunito Sans' fontWeight={900} fontSize={50}>
              ${SubscriptionPrices[ONETIME].toLocaleString()}
            </Text>
            <Text fontFamily='Nunito Sans' fontWeight={400} fontSize={40}>
              /one time
            </Text>
          </Box>
          <Text variant='cardSubtitle' textAlign='center'>
            Per License
          </Text>
          <PricingFeatures>
            <Text variant='cardSubtitle'>Generate one Bids</Text>
            <Text variant='cardSubtitle'>Cloud storage space</Text>
            <Text variant='cardSubtitle'>Send Bids Directly Customers</Text>
          </PricingFeatures>
        </Box>
        <Image src={homeSeparator} mt={120} display={['none', 'none', 'block']} />
        <Box variant='centeredColumn' width={400} mt={[0, 0, 50]}>
          <Box variant='centeredRow' alignItems='baseline' flexWrap='wrap' justifyContent='center' mb={12}>
            <Text fontFamily='Nunito Sans' fontWeight={900} fontSize={50}>
              ${SubscriptionPrices[MONTHLY].toLocaleString()}
            </Text>
            <Text fontFamily='Nunito Sans' fontWeight={400} fontSize={40}>
              /month
            </Text>
          </Box>
          <Text variant='cardSubtitle' textAlign='center'>
            Per License
          </Text>
          <PricingFeatures>
            <Text variant='cardSubtitle'>Generate Unlimited Bids</Text>
            <Text variant='cardSubtitle'>Unlimited Cloud Storage Space</Text>
            <Text variant='cardSubtitle'>Unlimited Editing</Text>
            <Text variant='cardSubtitle'>Send Bids Directly Customers</Text>
            <Text variant='cardSubtitle'>Email Distribution</Text>
            <Text variant='cardSubtitle'>Customer Support 24/7</Text>
          </PricingFeatures>
        </Box>
        <Image src={homeSeparator} mt={120} display={['none', 'none', 'block']} />
        <Box variant='centeredColumn' width={400}>
          <BestValueTag>
            <Text variant='label' color='white !important' lineHeight={0.7} pl={12}>
              Best Value
            </Text>
          </BestValueTag>
          <Box variant='centeredRow' alignItems='baseline' flexWrap='wrap' justifyContent='center' mb={12}>
            <Text fontFamily='Nunito Sans' fontWeight={900} fontSize={50}>
              ${SubscriptionPrices[ANNUAL].toLocaleString()}
            </Text>
            <Text fontFamily='Nunito Sans' fontWeight={400} fontSize={40}>
              /annual
            </Text>
          </Box>
          <Text variant='cardSubtitle' textAlign='center'>
            Per License
          </Text>
          <PricingFeatures>
            <Text variant='cardSubtitle'>Generate Unlimited Bids</Text>
            <Text variant='cardSubtitle'>Unlimited Cloud Storage Space</Text>
            <Text variant='cardSubtitle'>Unlimited Editing</Text>
            <Text variant='cardSubtitle'>Send Bids Directly Customers</Text>
            <Text variant='cardSubtitle'>Customer Support 24/7</Text>
            <Text variant='cardSubtitle'>Email Distribution</Text>
          </PricingFeatures>
        </Box>
      </StyledSubscriptionInfoContainer>
      <ContinueButton m='20px !important' variant={'primary'} onClick={() => history.push('/subscription')}>
        Get Started
      </ContinueButton>
      <StyledSignUpBox>
        <Box variant='centeredColumn'>
          <Text variant='sectionTitle' lineHeight={0.9} my={18}>
            Start your free trial
          </Text>
          <Box width={450} maxWidth='100%'>
            <Text variant='label'>Email</Text>
            <StyledTextField
              outlined
              type='email'
              name='email'
              onChange={e => {
                setIsValidEmail(isEmail(e.target.value));
                setEmail(e.target.value);
              }}
            />
          </Box>
          <ContinueButton
            m='20px !important'
            variant={!isValidEmail ? 'disabled' : 'primary'}
            disabled={!isValidEmail}
            onClick={() =>
              !user
                ? history.push({
                    pathname: '/register',
                    state: { formValues: { email } }
                  })
                : userLoggedInMessage()
            }
          >
            Continue
          </ContinueButton>
          <StyledTOCFooterText fontSize={12} fontFamily='Nunito Sans' fontWeight={400}>
            By signing in you agree with the
          </StyledTOCFooterText>
          <StyledTOCFooterTextMarginBottom fontSize={12} fontFamily='Nunito Sans' fontWeight={400}>
            <a href='/terms-of-use'>Terms and Conditions</a> and <a href='/privacy-policy'>Privacy Policy</a>
          </StyledTOCFooterTextMarginBottom>
        </Box>
      </StyledSignUpBox>
    </Layout>
  );
}

const StyledTOCFooterText = styled(Text)`
  margin: 0 30px;
  font-family: Nunito Sans;
  font-size: 12px;
  font-weight: 400;
  text-align: center;

  .a,
  a:link,
  a:visited,
  a:focus,
  a:hover,
  a:active {
    text-decoration: none !important;
    color: ${theme.activeNavLink};
  }
`;

const StyledTOCFooterTextMarginBottom = styled(Text)`
  margin: 0 30px;
  font-family: Nunito Sans;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 55px;
  text-align: center;

  .a,
  a:link,
  a:visited,
  a:focus,
  a:hover,
  a:active {
    text-decoration: none !important;
    color: ${theme.activeNavLink};
  }
`;

const StyledSubscriptionInfoContainer = styled(Box)`
  width: 80%;
  margin-bottom: 50px;
  justify-content: space-evenly;
  align-items: start;
  row-gap: 100px;
`;

const StyledMiddleCardSubtitle = styled(Text)`
  font-family: 'Nunito Sans';
  font-size: 18px;
  font-weight: 300;
  text-align: center;
  line-height: 1;
`;

const StyledMiddleCardTitle = styled(Text)`
  font-family: Chathura;
  font-size: 44px;
  font-weight: 800;
  text-transform: uppercase;
  margin-top: 50px;
  color: ${theme.companyBlue};
  -webkit-text-stroke: 1px ${theme.companyBlue};
  line-height: 0.7;
  margin-bottom: 20px;
`;

const StyledMiddleCards = styled(Box)`
  height: 340px;
  width: 310px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  background-image: linear-gradient(0deg, #f4f7ff, #ffffff);
  padding: 50px 30px;
`;

const StyledCardsContainer = styled(Box)`
  width: 80%;
  margin: -90px 0 100px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  column-gap: 40px;
  row-gap: 40px;
`;

const StyledImage = styled(Image)`
  left: 90px;
  bottom: -15px;
  position: absolute;
  width: 670px;
  z-index: -1;
`;

const StyledTOCText = styled(Text)`
  margin: 11px 0;
  font-family: 'Nunito Sans';
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.05em;
  .a,
  a:link,
  a:visited,
  a:focus,
  a:hover,
  a:active {
    text-decoration: none;
    color: ${theme.activeNavLink};
  }
`;

const StyledCheckbox = styled(RMWCCheckbox)<RMWCCheckboxProps & CheckboxHTMLProps>`
  width: 15px;
  height: 15px;
  margin-left: -10px;
  margin-top: -1px;

  .mdc-checkbox__background {
    background-color: #d8d8d8;
    border-color: #d8d8d8;
  }
  .mdc-checkbox__ripple {
    display: none !important;
  }
  --mdc-theme-secondary: ${theme.companyBlue};
`;
const CheckboxContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  margin: 0;
`;

const StyledSignInContainer = styled(Box)`
  width: 100%;
  height: 710px;
  position: relative;
  display: flex;
  justify-content: flex-end;
`;

const StyledSignUpBox = styled(Box)`
  width: 80%;
  margin-bottom: 150px;
`;

const StyledCard = styled(Box)`
  height: 477px;
  width: 414px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: ${theme.white};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const FormContainer = styled(Form)`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 40px 40px 40px;
  sup {
    display: none;
  }
`;

const BottomContainer = styled.div`
  margin-top: 10px;
  align-self: stretch;
  flex: 1;
  display: flex;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
  align-self: stretch;
  margin-bottom: 10px;
`;

const SignUpButton = styled(Button)<ButtonProps>`
  width: 100%;
  height: 66px;
  margin-bottom: 10px;
`;

const ContinueButton = styled(SignUpButton)`
  width: 20%;
  min-width: 180px;
  border: none;
  margin-bottom: 30px !important;
`;

const PricingFeatures = styled(Box)`
  margin-top: 40px;
  line-height: 1.5;

  > p::before {
    content: url(${checkMark});
    margin-right: 10px;
  }
`;

const BestValueTag = styled(Box)`
  position: relative;
  align-self: flex-end;
  background: ${theme.primary};
  height: 50px;
  width: 90px;
  display: flex;
  align-items: center;
  text-align: center;

  ::before {
    content: '';
    border-style: solid;
    border-width: 25px 13px 25px 13px;
    border-color: #0000 #0000 #0000 #fff;
    position: absolute;
    height: 100%;
  }
`;

export default withRouter(Home);
