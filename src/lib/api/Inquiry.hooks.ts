import { useCallback } from 'react';
import { HttpMethod } from './Api';
import { useApiMutation } from './Api.hooks';

export type InquiryDto = {
  inquiryType: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export function useSendInquiry() {
  const { mutate, ...rest } = useApiMutation<void, InquiryDto>(null, HttpMethod.POST, 'inquiry');

  const doSendInquiry = useCallback(
    async (inquiry: InquiryDto) => {
      await mutate(inquiry);
    },
    [mutate]
  );

  return { ...rest, doSendInquiry };
}
