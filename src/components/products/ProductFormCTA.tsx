'use client';

import { useRouter } from 'next/navigation';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import {
  TopBarCTA,
  Button,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components';
import { ProductSchema, Product, BackendError, ValidationErrors, defaultLocale } from '@/api';
import {
  useBrandsQuery,
  useCategoriesQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useRemoveProductMutation,
} from '@/hooks';
import { HugeiconsIcon } from '@hugeicons/react';
import { Trash } from '@hugeicons/core-free-icons';

interface ProductFormCTAProps {
  product?: Product;
}

export const ProductFormCTA = ({ product }: ProductFormCTAProps) => {
  const isEditMode = !!product;

  const form = useFormContext<ProductSchema>();
  const router = useRouter();

  const brandsQuery = useBrandsQuery();
  const categoriesQuery = useCategoriesQuery();
  const addProductMutation = useAddProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  const isLoading =
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
      if (!product) return;

      return updateProductMutation.mutate({ id: product.id, ...data }, { onSuccess, onError });
    }

    addProductMutation.mutate(data, { onSuccess, onError });
  };

  return (
    <TopBarCTA>
      {form.formState.isDirty && form.formState.isValid && (
        <>
          <Button
            isLoading={isLoading}
            onClick={form.handleSubmit(onSubmit, console.warn)}
            loadingIconClassName="size-4"
          >
            {isEditMode ? 'Save' : 'Add'}
          </Button>

      {isEditMode && (
        <Button variant="destructive" isDisabled={isLoading} onClick={() => form.reset()}>
          Discard
        </Button>
      )}
        </>
      )}

      {isEditMode && <RemoveProduct isDisabled={isLoading} {...product!} />}
    </TopBarCTA>
  );
};

interface RemoveProductProps extends Product {
  isDisabled?: boolean;
}

const RemoveProduct = ({ isDisabled, id, name }: RemoveProductProps) => {
  const router = useRouter();

  const removeProductMutation = useRemoveProductMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button isDisabled={isDisabled} variant="destructive" icon={<HugeiconsIcon icon={Trash} />} />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Product</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove the {name[defaultLocale]} product?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              removeProductMutation.mutate(id, {
                onSuccess: () => {
                  toast.success(`${name[defaultLocale]} product removed successfully`);

                  router.push('/products');
                },
              })
            }
          >
            Remove Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
