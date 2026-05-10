'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  addBrandSchema,
  AddBrandSchema,
  BackendError,
  Brand,
  defaultLocale,
  locales,
  Localized,
  updateBrandSchema,
  UpdateBrandSchema,
  ValidationErrors,
} from '@/api';
import { useUploadMediaStore } from '@/stores';
import { Disclosure, useAddBrandMutation, useUpdateBrandMutation } from '@/hooks';

import { Form } from '../Form';
import { Field, FieldError } from '../ui';
import { UploadMedia } from '../UploadMedia';
import { LocalizedForm } from '../LocalizedForm';
import { Button } from '../Button';
import { Modal } from '../Modal';

interface BrandFormModalProps {
  brand?: Brand;
  disclosure: Disclosure;
}

const defaultValues: AddBrandSchema = {
  image: null,
  name: locales.reduce<Localized>((acc, locale) => ({ ...acc, [locale]: '' }), { [defaultLocale]: '' }),
} as unknown as AddBrandSchema;

export const BrandFormModal = ({ brand, disclosure }: BrandFormModalProps) => {
  const form = useForm<AddBrandSchema | UpdateBrandSchema>({
    defaultValues: brand
      ? ({
          imageId: brand.image?.id,
          name: brand.name,
        } as UpdateBrandSchema)
      : defaultValues,
    mode: 'onChange',
    resolver: zodResolver(brand ? updateBrandSchema : addBrandSchema),
  });

  const updateBrandMutation = useUpdateBrandMutation();
  const addBrandMutation = useAddBrandMutation();

  const isUploading = useUploadMediaStore((state) => state.files.some((f) => f.state === 'uploading'));

  const onOpenChange = (open: boolean) => {
    if (isUploading) return;

    if (!open) {
      form.reset();
      updateBrandMutation.reset();
      addBrandMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<AddBrandSchema | UpdateBrandSchema> = async (data) => {
    if (!form.formState.isValid || addBrandMutation.isPending) return;

    const onSuccess = ({ name }: Brand) => {
      toast.success(`Brand "${name[defaultLocale]}" ${brand ? 'updated' : 'added'} successfully.`);

      onOpenChange(false);
    };

    const onError = (
      validationErrors: BackendError<ValidationErrors<keyof (AddBrandSchema | UpdateBrandSchema)>> | null,
    ) => {
      if (!validationErrors) return;

      validationErrors.errors.forEach((error) => {
        form.setError(error.property, { message: error.messages[0] });
      });
    };

    if (brand) return updateBrandMutation.mutate({ ...data, id: brand.id }, { onSuccess, onError });

    addBrandMutation.mutate(data as AddBrandSchema, { onSuccess, onError });
  };

  return (
    <Modal
      title={brand ? `Update ${brand.name[defaultLocale]} Brand` : 'Add New Brand'}
      description={
        brand
          ? `Update the ${brand.name[defaultLocale]} brand information.`
          : 'Add a new brand to the platform to allow users to filter products by it.'
      }
      asChild
      {...disclosure}
      onOpenChange={onOpenChange}
    >
      <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onSubmit} {...form}>
        <Controller
          name="imageId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <UploadMedia folder="brand" onSuccess={([{ id }]) => field.onChange(id)} />

              {fieldState.invalid && (
                <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <LocalizedForm<AddBrandSchema> name="name" />

        <Button
          type="submit"
          variant="default"
          className="w-full h-auto py-2 text-lg"
          isDisabled={!form.formState.isValid || addBrandMutation.isSuccess || isUploading}
          isLoading={addBrandMutation.isPending}
        >
          {brand ? 'Update' : 'Add'} Brand
        </Button>
      </Form>
    </Modal>
  );
};
