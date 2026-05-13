'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, Policy, PolicySchema, PolicyType, ValidationErrors, gamersCoreAdmin } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidatePoliciesQuery } from './usePoliciesQuery';

interface UpdatePolicyMutationOptions extends PolicySchema {
  type: PolicyType;
}

export const usePoliciesMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidatePoliciesQuery = useInvalidatePoliciesQuery();

  return useMutation<Policy, BackendError<ValidationErrors<keyof PolicySchema>> | null, UpdatePolicyMutationOptions>({
    mutationFn: ({ type, ...data }) =>
      gamersCoreAdmin
        .put<Policy, AxiosResponse<Policy>, PolicySchema>(`/policies/${type}`, data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidatePoliciesQuery();
    },
  });
};
