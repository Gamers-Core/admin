'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/stores';

import { Toaster, TooltipProvider } from './ui';

interface ProvidersProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
}

export const Providers = ({ children, isLoggedIn = false }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());

  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  useEffect(() => {
    setIsLoggedIn(isLoggedIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>

      <Toaster duration={5000} richColors position="top-center" />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
