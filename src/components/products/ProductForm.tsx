'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMemo } from 'react';

import { Form } from '@/components';
import { useAddProductMutation, useUpdateProductMutation } from '@/hooks';
import {
  productSchema,
  ProductSchema,
  defaultLocalizedValue,
  Product,
  BackendError,
  ValidationErrors,
  defaultLocale,
} from '@/api';

interface ProductFormProps {
  children: React.ReactNode;
  className?: string;
  product?: Product;
}

const defaultValues: ProductSchema = {
  name: defaultLocalizedValue,
  title: defaultLocalizedValue,
  description: defaultLocalizedValue,
  status: 'draft',
  variants: [],
  media: [],
  brandId: null as unknown as number,
  categoryId: null as unknown as number,
};

export const ProductForm = (props: ProductFormProps) => {
  const values = useMemo(() => (props.product ? mapProductToSchema(props.product) : defaultValues), [props.product]);

  const form = useForm<ProductSchema>({
    defaultValues: values,
    mode: 'onChange',
    resolver: zodResolver(productSchema),
  });
  const router = useRouter();

  const isEditMode = Boolean(props.product);

  const addProductMutation = useAddProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  const isPending = addProductMutation.isPending || updateProductMutation.isPending;

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    if (!form.formState.isValid || isPending) return;

    const onSuccess = (product: Product) => {
      toast.success(`Product ${product.name[defaultLocale]} ${isEditMode ? 'updated' : 'added'} successfully.`);

      router.push(`/products`);
    };

    const onError = (validationErrors: BackendError<ValidationErrors<keyof ProductSchema>> | null) => {
      if (!validationErrors) return;

      validationErrors.errors.forEach((error) => {
        form.setError(error.property, { message: error.messages[0] });
      });

      toast.error('Please review the form and fix the errors before submitting again.');
    };

    if (isEditMode) return updateProductMutation.mutate({ id: props.product!.id, ...data }, { onSuccess, onError });

    await addProductMutation.mutateAsync(data, { onSuccess, onError });
  };

  return <Form {...form} onSubmit={onSubmit} {...props} />;
};

const mapProductToSchema = ({ brand, category, variants, ...product }: Product): ProductSchema => ({
  ...product,
  brandId: brand?.id ?? (null as unknown as number),
  categoryId: category?.id ?? (null as unknown as number),
  variants: variants.map(({ image, compareAt, ...variant }) => ({
    ...variant,
    image,
    imageId: image.id,
    compareAt: compareAt ?? 0,
  })),
});
