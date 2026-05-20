'use client';

import { useFormContext } from 'react-hook-form';

import { ProductSchema } from '@/api';
import { Button } from '@/components';
import { useBrandsQuery, useCategoriesQuery } from '@/hooks';

interface SubmitProductButtonProps {
  mode?: 'add' | 'edit';
}

export const SubmitProductButton = ({ mode = 'add' }: SubmitProductButtonProps) => {
  const form = useFormContext<ProductSchema>();

  const brandsQuery = useBrandsQuery();
  const categoriesQuery = useCategoriesQuery();

  return (
    <Button
      type="submit"
      isDisabled={!form.formState.isValid || !form.formState.isDirty}
      isLoading={form.formState.isSubmitting || categoriesQuery.isPending || brandsQuery.isPending}
      className="w-full h-12 text-base"
    >
      {mode === 'edit' ? 'Save Changes' : 'Add Product'}
    </Button>
  );
};
