// Reference: https://www.robinwieruch.de/react-hooks-fetch-data/

import { useCallback, useEffect, useRef, useState } from 'react';

import useUser from '../user/useUser';
import Api, { apiHelper, ApiParams, HttpMethod, HttpStatusCode, StaticUrls } from './Api';

export function useApiGet<T>(initialData: T, path: string) {
  const [data, setData] = useState<{ response: Response | null; data: T }>({ response: null, data: initialData });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const unmounted = useRef(false);
  const [, setUser] = useUser();

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const get = useCallback(
    async (params: ApiParams = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const [response, body] = await Api.get(path, params);

        if (!response.ok) {
          if (response.status === HttpStatusCode.FORBIDDEN && response.url === StaticUrls.REFRESH) setUser(null);
          !unmounted.current && setError(new Error(body.message || body.error));
        }

        !unmounted.current && setData({ response, data: body });
      } catch (error) {
        !unmounted.current && setError(error);
      }

      !unmounted.current && setIsLoading(false);
    },
    [path, setData, setIsLoading, setError, unmounted, setUser]
  );

  return { ...data, isLoading, error, get };
}

export function useApiMutation<T, P>(initialData: T | null, method: HttpMethod, path: string) {
  const [data, setData] = useState<{ response: Response | null; data: T | null }>({ response: null, data: initialData });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const mutate = useCallback(
    async (params?: P) => {
      setIsLoading(true);
      setError(null);

      try {
        const [response, body] = await apiHelper(method, path, params);

        if (!response.ok) {
          !unmounted.current && setError(new Error(body.message || body.error));
        }

        !unmounted.current && setData({ response, data: body });
      } catch (error) {
        !unmounted.current && setError(error);
      }

      !unmounted.current && setIsLoading(false);
    },
    [method, path, setData, setIsLoading, setError, unmounted]
  );

  return { ...data, isLoading, error, mutate };
}
