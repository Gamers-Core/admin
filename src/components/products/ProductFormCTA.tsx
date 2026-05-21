'use client';

import { useRouter } from 'next/navigation';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { TopBarCTA, Button } from '@/components';
import { ProductSchema, Product, BackendError, ValidationErrors, defaultLocale } from '@/api';
import { useBrandsQuery, useCategoriesQuery, useAddProductMutation, useUpdateProductMutation } from '@/hooks';

interface ProductFormCTAProps {
  isEditMode: boolean;
  productId?: number;
}

export const ProductFormCTA = ({ isEditMode, productId }: ProductFormCTAProps) => {
  const form = useFormContext<ProductSchema>();
  const router = useRouter();

  const brandsQuery = useBrandsQuery();
  const categoriesQuery = useCategoriesQuery();
  const addProductMutation = useAddProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  const isLoading =
    form.formState.isSubmitting ||
    brandsQuery.isPending ||
    categoriesQuery.isPending ||
    addProductMutation.isPending ||
    updateProductMutation.isPending;

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    if (isLoading) return;

    const onSuccess = (product: Product) => {
      toast.success(`Product ${product.name[defaultLocale]} ${isEditMode ? 'updated' : 'added'} successfully.`);

      router.push('/products');
    };

    const onError = (validationErrors: BackendError<ValidationErrors<keyof ProductSchema>> | null) => {
      if (!validationErrors) return;

      validationErrors.errors.forEach((error) => {
        form.setError(error.property, { message: error.messages[0] });
      });

      toast.error('Please review the form and fix the errors before submitting again.');
    };

    if (isEditMode) {
      if (!productId) return;

      return updateProductMutation.mutate({ id: productId, ...data }, { onSuccess, onError });
    }

    await addProductMutation.mutateAsync(data, { onSuccess, onError });
  };

  if (!form.formState.isDirty) return null;

  return (
    <TopBarCTA>
      <Button isLoading={isLoading} onClick={form.handleSubmit(onSubmit, console.warn)} loadingIconClassName="size-4">
        {isEditMode ? 'Save' : 'Add'}
      </Button>

      {isEditMode && (
        <Button variant="destructive" isDisabled={isLoading} onClick={() => form.reset()}>
          Discard
        </Button>
      )}
    </TopBarCTA>
  );
};
