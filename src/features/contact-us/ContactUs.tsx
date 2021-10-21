import React from 'react';
import { Select, SelectHTMLProps, SelectProps } from '@rmwc/select';
import WebSnackbarQueue from '../../lib/WebSnackbarQueue';
import * as Yup from 'yup';

import { Layout, Box, Text, FormField, TextField } from '../../components';
import { contactUsHeader } from '../../assets/images';
import styled, { css } from '../../styled-components';
import { ErrorMessages, SuccessMessages } from '../../constants/Strings';
import theme from '../../constants/Theme';
import { Form, Formik, FormikHelpers as FormikActions } from 'formik';
import { TextFieldProps } from '../../components/TextField';
import { TextFieldHTMLProps } from '@rmwc/textfield';
import Button, { ButtonProps } from '../../components/Button';
import { CircularProgress } from '@rmwc/circular-progress';
import { useSendInquiry } from '../../lib/api/Inquiry.hooks';
import { InquiryTypes } from '../../constants/Inquiry';

type ContactUsFormValues = {
  inquiryType: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

type StyledFieldProps = {
  error?: string;
  touched?: boolean;
};

const ContactUsFormSchema = Yup.object().shape({
  inquiryType: Yup.string().required(ErrorMessages.REQUIRED),
  firstName: Yup.string().required(ErrorMessages.REQUIRED),
  lastName: Yup.string().required(ErrorMessages.REQUIRED),
  email: Yup.string()
    .email(ErrorMessages.INVALID_EMAIL)
    .required(ErrorMessages.REQUIRED),
  message: Yup.string().required(ErrorMessages.REQUIRED)
});

const banner = {
  image: `url(${contactUsHeader})`,
  text: 'Connect with Us'
};

function ContactUs() {
  const { doSendInquiry } = useSendInquiry();
  const initialValues: ContactUsFormValues = {
    inquiryType: '',
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  };

  const handleOnSubmit = async (values: ContactUsFormValues, actions: FormikActions<ContactUsFormValues>) => {
    const { resetForm, setSubmitting } = actions;
    setSubmitting(true);
    await doSendInquiry(values);
    WebSnackbarQueue.notify({
      dismissesOnAction: true,
      title: SuccessMessages.INQUIRY_SENT,
      actions: [
        {
          label: 'DISMISS'
        }
      ]
    });
    setSubmitting(false);
    resetForm();
  };

  return (
    <Layout variant='centeredColumn' banner={banner} hideSubscriptionAlert hidePatternHeader>
      <Box
        variant='centeredRow'
        alignItems='flex-start'
        width='100%'
        mt={90}
        mb={120}
        display='flex'
        flexWrap='wrap'
        justifyContent='space-between'
        maxWidth={1200}
        padding='0 60px'
      >
        <Box width={300}>
          <Text fontFamily='Nunito Sans' fontWeight={900} fontSize={72}>
            Call Us
          </Text>
          <Text fontFamily='Nunito Sans' fontSize={28}>
            You can reach us at (888) 123-4567
          </Text>
        </Box>
        <Box width={500} maxWidth='100%'>
          <Text variant='sectionTitle' lineHeight='70 px'>
            Send us a message
          </Text>
          <Formik initialValues={initialValues} validationSchema={ContactUsFormSchema} validateOnBlur={true} onSubmit={handleOnSubmit}>
            {({ isSubmitting, values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
              <FormContainer>
                <StyledFormField
                  label='Inquiry Type'
                  required
                  validationMsg={touched.inquiryType && errors.inquiryType ? errors.inquiryType : ''}
                >
                  <StyledSelect
                    enhanced
                    outlined
                    name='inquiryType'
                    onBlur={() => setFieldTouched('inquiryType', true)}
                    onChange={e => {
                      setFieldValue('inquiryType', e.currentTarget.value);
                    }}
                    error={errors.inquiryType}
                    touched={touched.inquiryType}
                    value={values.inquiryType}
                    options={InquiryTypes}
                  />
                </StyledFormField>
                <StyledFormField label='First Name' required validationMsg={touched.firstName && errors.firstName ? errors.firstName : ''}>
                  <StyledTextField
                    outlined
                    type='text'
                    name='firstName'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstName}
                    floatLabel={false}
                    error={errors.firstName}
                    touched={touched.firstName}
                  />
                </StyledFormField>
                <StyledFormField label='Last Name' required validationMsg={touched.lastName && errors.lastName ? errors.lastName : ''}>
                  <StyledTextField
                    outlined
                    type='text'
                    name='lastName'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName}
                    floatLabel={false}
                    error={errors.lastName}
                    touched={touched.lastName}
                  />
                </StyledFormField>
                <StyledFormField label='Email Address' required validationMsg={touched.email && errors.email ? errors.email : ''}>
                  <StyledTextField
                    outlined
                    type='email'
                    name='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    floatLabel={false}
                    error={errors.email}
                    touched={touched.email}
                  />
                </StyledFormField>
                <StyledFormField label='Message' required validationMsg={touched.message && errors.message ? errors.message : ''}>
                  <StyledTextArea
                    textarea
                    outlined
                    type='text'
                    name='message'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.message}
                    floatLabel={false}
                    error={errors.message}
                    touched={touched.message}
                  />
                </StyledFormField>
                <SubmitFormButton variant='primary' type='submit' disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : null}
                  Submit
                </SubmitFormButton>
              </FormContainer>
            )}
          </Formik>
        </Box>
      </Box>
    </Layout>
  );
}

const Spinner = styled(CircularProgress)`
  color: white;
  margin-right: 4px;
`;

const StyledTextArea = styled(TextField)<StyledFieldProps & TextFieldProps & TextFieldHTMLProps>`
  ${({ error, touched, theme }) => css`
    max-width: 492px;
    margin-bottom: 30px;
    &&& {
      textarea {
        height: 102px;
      }
      * {
        height: 112px;
        border-color: ${error && touched ? theme.destructiveColor : theme.alto};
        resize: none;
        line-height: 22px;
      }
    }
  `};
`;

const SubmitFormButton = styled(Button)<ButtonProps>`
  width: 100%;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 22px;
  max-width: 206px;
`;

const FormContainer = styled(Form)`
  .mdc-text-field-helper-line {
    padding: 0;
  }
  .mdc-select-helper-text {
    color: ${theme.inputInvalid};
  }
`;

const StyledFormField = styled(FormField)`
  margin-bottom: 10px;
  max-width: 492px;
  p {
    color: ${theme.black};
    line-height: 30px;
  }
  sup {
    display: none;
  }
`;

const StyledTextField = styled(TextField)<TextFieldProps & TextFieldHTMLProps>`
  max-width: 492px;
`;

const StyledSelect = styled(Select)<StyledFieldProps & SelectProps & SelectHTMLProps>`
  ${({ error, touched, theme }) => css`
    &&& {
      * {
        border-color: ${error && touched ? theme.destructiveColor : theme.alto};
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
  `};
`;

export default ContactUs;
