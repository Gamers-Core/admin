'use client';

import { useFormContext } from 'react-hook-form';

import { AddProductSchema } from '@/api';
import { Button } from '@/components';
import { useBrandsQuery, useCategoriesQuery } from '@/hooks';

export const AddProductButton = () => {
  const form = useFormContext<AddProductSchema>();

  const brandsQuery = useBrandsQuery();
  const categoriesQuery = useCategoriesQuery();

  return (
    <Button
      type="submit"
      isDisabled={!form.formState.isValid}
      isLoading={form.formState.isSubmitting || categoriesQuery.isPending || brandsQuery.isPending}
      className="w-full h-12 text-base"
    >
      Add Product
    </Button>
  );
};
