'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Form } from '@/components';
import { useAddProductMutation } from '@/hooks';
import { addProductSchema, AddProductSchema, defaultLocalizedValue } from '@/api';

interface AddProductFormProps {
  children: React.ReactNode;
  className?: string;
}

const defaultValues: AddProductSchema = {
  name: defaultLocalizedValue,
  title: defaultLocalizedValue,
  description: defaultLocalizedValue,
  status: 'draft',
  variants: [],
  mediaIds: [],
  brandId: null as unknown as number,
  categoryId: null as unknown as number,
};

export const AddProductForm = (props: AddProductFormProps) => {
  const form = useForm<AddProductSchema>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(addProductSchema),
  });
  const router = useRouter();

  const addProductMutation = useAddProductMutation();

  const onSubmit: SubmitHandler<AddProductSchema> = async (data) => {
    if (!form.formState.isValid || addProductMutation.isPending) return;

    await addProductMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success('Product added successfully.');

        router.push('/products');
      },
      onError: (validationErrors) => {
        if (!validationErrors) return;

        validationErrors.errors.forEach((error) => {
          form.setError(error.property, { message: error.messages[0] });
        });
      },
    });
  };

  return <Form {...form} onSubmit={onSubmit} {...props} />;
};
