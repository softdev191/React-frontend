import * as jwt from 'jsonwebtoken';
import { useCallback, useEffect } from 'react';

import Defaults from '../../constants/Defaults';
import { BusinessType, SubcontractorCategory } from '../../constants/Bid';
import { ErrorMessages } from '../../constants/Strings';
import { AccessToken } from '../../types/AccessToken';
import { User, UserRegisterDto } from '../../types/User';
import useUser from '../user/useUser';
import { HttpMethod, HttpStatusCode, removeAccessToken, setAccessToken } from './Api';
import { useApiGet, useApiMutation } from './Api.hooks';
import { MediaCreateDTO } from './Media.hooks';
import { Subscription } from '../../types/Subscription';
import { Card } from '../../types/Card';

export function useGetCurrentUser() {
  const { data, response, isLoading, error, get } = useApiGet<User | null | undefined>(undefined, 'users/me');
  let errorMessage;
  let returnData = data;

  useEffect(() => {
    if (response && !response.ok) {
      if (response.status === HttpStatusCode.UNAUTHORIZED || response.status === HttpStatusCode.FORBIDDEN) {
        removeAccessToken();
      }
    }
  }, [response]);

  if (response && !response.ok) {
    errorMessage = ErrorMessages.INVALID_SESSION;
    returnData = null;
  }

  return { data: returnData, isLoading, error: error || errorMessage, get };
}

export type LogInDTO = {
  username: string;
  password: string;
};

export function useLogin() {
  const [user, setUser] = useUser();
  const { data, response, isLoading, error, mutate } = useApiMutation<AccessToken, LogInDTO>(null, HttpMethod.POST, 'users/login');

  useEffect(() => {
    if (response && response.ok && data) {
      setAccessToken(data.accessToken, data.refreshToken);
      const message: any = jwt.decode(data.accessToken);
      setUser({
        id: message.sub,
        username: message.name,
        email: message.email,
        created: message.created,
        modified: message.modified,
        userDetail: message.userDetail,
        roles: message.roles
      });
    }
  }, [response, data, setUser]);

  const doLogin = useCallback(
    async (username: string, password: string) => {
      await mutate({ username, password });
    },
    [mutate]
  );

  return { data: data && user, isLoading, error, doLogin };
}

export type ResetPasswordDTO = {
  username?: string | undefined;
};
export function useSignInHelpResetPassword() {
  const { data, response, isLoading, error, mutate } = useApiMutation<AccessToken, ResetPasswordDTO>(
    null,
    HttpMethod.POST,
    'users/request-password-reset'
  );
  const doSigninHelpResetPassword = useCallback(
    async (username?: string | undefined) => {
      await mutate({ username });
    },
    [mutate]
  );
  return { data: data && response?.ok, isLoading, error, doSigninHelpResetPassword };
}

export type RequestUsernameDTO = {
  email?: string | undefined;
};
export function useSignInHelpRequestUsername() {
  const { data, response, isLoading, error, mutate } = useApiMutation<AccessToken, RequestUsernameDTO>(
    null,
    HttpMethod.POST,
    'users/request-username'
  );
  const doSigninHelpRequestUsername = useCallback(
    async (email?: string | undefined) => {
      await mutate({ email });
    },
    [mutate]
  );
  return { data: data && response?.ok, isLoading, error, doSigninHelpRequestUsername };
}

export function useLogout() {
  const [, setUser] = useUser();
  const { response, isLoading, error, mutate } = useApiMutation(null, HttpMethod.POST, 'users/logout');

  useEffect(() => {
    if (response && response.ok) {
      removeAccessToken();
      setUser(null);
    }
  }, [response, setUser]);

  const doLogout = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return { isLoading, error, doLogout };
}

// Example of the most simple implementation
export function useGetUser(userId: string) {
  return useApiGet<User | null>(null, 'users/' + userId);
}

// Example of a more typical implementation
export function useGetUsersByPage() {
  const { get: originalGet, ...rest } = useApiGet<User[]>([], 'users/');

  const get = useCallback(
    async (params: { page?: number; query?: string; sort?: string; limit?: number }) => {
      const defaults = {
        page: 0,
        limit: Defaults.LIST_PAGE_SIZE
      };
      await originalGet({ ...defaults, ...params });
    },
    [originalGet]
  );

  return { ...rest, get };
}

export function useGetUsersCount() {
  return useApiGet<number | null>(null, 'users/count');
}

export type UserUpdateDTO = {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  businessType?: BusinessType;
  subContractorName?: string;
  subContractorCategory?: SubcontractorCategory;
  companyLogo?: MediaCreateDTO;
  currentPassword?: string;
  newPassword?: string;
};

export function useUpdateUser() {
  const { mutate, ...rest } = useApiMutation<User, UserUpdateDTO>(null, HttpMethod.PATCH, 'users/me/profile');

  const update = useCallback(
    async (user: UserUpdateDTO) => {
      await mutate(user);
    },
    [mutate]
  );

  return { ...rest, update };
}

export function useCreateUser() {
  const { mutate, ...rest } = useApiMutation<User, UserRegisterDto>(null, HttpMethod.POST, 'users/register');

  const create = useCallback(
    async (user: UserRegisterDto) => {
      await mutate(user);
    },
    [mutate]
  );

  return { ...rest, create };
}

export function useDeleteUser(userId: string) {
  const { mutate, ...rest } = useApiMutation<User, null>(null, HttpMethod.DELETE, 'users/' + userId);

  const userDelete = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return { ...rest, userDelete };
}

export type RolesDTO = {
  id: number;
  name: string;
};

export function useGetAllRoles() {
  return useApiGet<RolesDTO[] | null>([], 'roles');
}

export function useVerifyAccount() {
  const { mutate, ...rest } = useApiMutation<void, { tokenString: string }>(null, HttpMethod.POST, 'users/verify');

  const doVerifyAccount = useCallback(
    async (tokenString: string) => {
      await mutate({ tokenString });
    },
    [mutate]
  );

  return { ...rest, doVerifyAccount };
}

export function useVerifyPasswordReset() {
  const { mutate, ...rest } = useApiMutation<void, { tokenString: string }>(null, HttpMethod.POST, 'users/verify-password-reset');

  const doVerifyPasswordReset = useCallback(
    async (tokenString: string) => {
      await mutate({ tokenString });
    },
    [mutate]
  );

  return { ...rest, doVerifyPasswordReset };
}

export type UserGetSubscriptionDTO = {
  subscription: Subscription;
  card: Card;
  trialEnded: boolean;
};

export function useGetSubscriptionById(userId: number) {
  return useApiGet<UserGetSubscriptionDTO | null | undefined>(undefined, `subscriptions/${userId}`);
}

export function useResetPassword() {
  const { mutate, ...rest } = useApiMutation<void, { tokenString: string; password: string }>(
    null,
    HttpMethod.POST,
    'users/reset-password'
  );

  const doResetPassword = useCallback(
    async (tokenString: string, password: string) => {
      await mutate({ tokenString, password });
    },
    [mutate]
  );

  return { ...rest, doResetPassword };
}

export interface BidSubscriptionPriceDTO {
  type: number;
}

export function usePortalUrl(userId: number) {
  const { get: originalGet, ...rest } = useApiGet<{ url: string } | null>(null, `subscriptions/${userId}/portal`);

  const get = useCallback(
    async (type: BidSubscriptionPriceDTO) => {
      await originalGet(type);
    },
    [originalGet]
  );

  return { ...rest, get };
}
