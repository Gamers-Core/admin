import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';

import { BackendError, gamersCoreAdmin, Product } from '@/api';

const queryKey = (id: number) => ['product', id] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, id] }: QueryFunctionContext<QueryKey>) =>
  gamersCoreAdmin.get<Product>(`/products/${id}`).then((res) => res.data);

export const useProductQuery = (id: number) =>
  useQuery<Product, BackendError, Product, QueryKey>({
    queryKey: queryKey(id),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

export const useSetProductData = () => {
  const queryClient = useQueryClient();

  return (id: number, data: Product) => queryClient.setQueryData(queryKey(id), data);
};

useProductQuery.queryKey = queryKey;
useProductQuery.queryFn = queryFn;
