'use client';

import { toast } from 'sonner';
import { AxiosError } from 'axios';

import { BackendError, ValidationErrors } from '@/api';

export const useErrorHandler = () => {
  return (error: AxiosError<BackendError>) => {
    if (!(error instanceof AxiosError)) return null;

    const data = error.response?.data;

    if (!data) {
      toast.error('An unknown error occurred. Please try again.');
      return null;
    }

    if ('errors' in data) return data as BackendError<ValidationErrors>;

    if ('message' in data) {
      toast.error(data.message);
      return null;
    }

    toast.error('An unknown error occurred. Please try again.');
    return null;
  };
};
