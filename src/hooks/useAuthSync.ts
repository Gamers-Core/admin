'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores';

import { useMeQuery } from './users';
import { useLogoutMutation } from './auth';

export const useAuthSync = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setUser = useAuthStore((state) => state.setUser);

  const meQuery = useMeQuery(isLoggedIn);
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    if (meQuery.error?.response?.data.status === 401 && !logoutMutation.isPending)
      logoutMutation.mutate(void 0, {
        onSuccess: () => {
          toast.error('Unauthorized');
        },
      });
  }, [logoutMutation, meQuery.error]);

  useEffect(() => {
    if (meQuery.isSuccess) return setUser(meQuery.data);

    if (meQuery.isError) return setUser(null);
  }, [meQuery.isSuccess, meQuery.data, meQuery.isError, setUser]);
};
