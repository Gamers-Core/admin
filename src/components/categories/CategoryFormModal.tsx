'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  BackendError,
  Category,
  categorySchema,
  CategorySchema,
  defaultLocale,
  defaultLocalizedValue,
  ValidationErrors,
} from '@/api';
import { Disclosure, useAddCategoryMutation, useUpdateCategoryMutation } from '@/hooks';

import { Form } from '../Form';
import { LocalizedForm } from '../LocalizedForm';
import { Button } from '../Button';
import { Modal, ModalFooter } from '../Modal';

interface CategoryFormModalProps {
  category?: Category;
  disclosure: Disclosure;
}

const defaultValues: CategorySchema = {
  name: defaultLocalizedValue,
};

export const CategoryFormModal = ({ category, disclosure }: CategoryFormModalProps) => {
  const form = useForm<CategorySchema>({
    defaultValues: category ?? defaultValues,
    mode: 'onChange',
    resolver: zodResolver(categorySchema),
  });

  const updateCategoryMutation = useUpdateCategoryMutation();
  const addCategoryMutation = useAddCategoryMutation();

  const isLoading = updateCategoryMutation.isPending || addCategoryMutation.isPending;

  useEffect(() => {
    if (!disclosure.open) return;
    form.reset(category ?? defaultValues);
  }, [category, disclosure.open, form]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      updateCategoryMutation.reset();
      addCategoryMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<CategorySchema> = async (data) => {
    if (!form.formState.isValid || isLoading) return;

    const onSuccess = ({ name }: Category) => {
      toast.success(`Category "${name[defaultLocale]}" ${category ? 'updated' : 'added'} successfully.`);

      onOpenChange(false);
    };

    const onError = (validationErrors: BackendError<ValidationErrors<keyof CategorySchema>> | null) => {
      if (!validationErrors) return;

      validationErrors.errors.forEach((error) => {
        form.setError(error.property, { message: error.messages[0] });
      });
    };

    if (category) return updateCategoryMutation.mutate({ ...data, id: category.id }, { onSuccess, onError });

    addCategoryMutation.mutate(data, { onSuccess, onError });
  };

  return (
    <Modal
      title={category ? `Update ${category.name[defaultLocale]} Category` : 'Add New Category'}
      description={
        category
          ? `Update the ${category.name[defaultLocale]} category information.`
          : 'Add a new category to the platform to allow users to filter products by it.'
      }
      asChild
      {...disclosure}
      onOpenChange={onOpenChange}
    >
      <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onSubmit} {...form}>
        <LocalizedForm<CategorySchema> name="name" />

        <ModalFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full h-auto py-2 text-lg"
            isDisabled={!form.formState.isValid || addCategoryMutation.isSuccess || updateCategoryMutation.isSuccess}
            isLoading={isLoading}
          >
            {category ? 'Update' : 'Add'} Category
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
