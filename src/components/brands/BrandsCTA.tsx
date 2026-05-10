'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AddBrandSchema, addBrandSchema, defaultLocale } from '@/api';
import { useUploadMediaStore } from '@/stores';
import { useAddBrandMutation, useDisclosure } from '@/hooks';

import { Button } from '../Button';
import { UploadMedia } from '../UploadMedia';
import { Modal } from '../Modal';
import { Field, FieldError } from '../ui';
import { LocalizedForm } from '../LocalizedForm';
import { Form } from '../Form';

const defaultValues: AddBrandSchema = {
  image: null,
  name: {
    en: '',
    ar: '',
  },
} as unknown as AddBrandSchema;

export const BrandsCTA = () => {
  const form = useForm<AddBrandSchema>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(addBrandSchema),
  });

  const modalDisclosure = useDisclosure();

  const addBrandMutation = useAddBrandMutation();
  const isUploading = useUploadMediaStore((state) => state.files.some((f) => f.state === 'uploading'));

  const onOpenChange = (open: boolean) => {
    if (isUploading) return;

    if (!open) {
      form.reset();
      addBrandMutation.reset();
    }

    modalDisclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<AddBrandSchema> = async (data) => {
    if (!form.formState.isValid || addBrandMutation.isPending) return;

    addBrandMutation.mutate(data, {
      onSuccess: ({ name }) => {
        toast.success(`Brand "${name[defaultLocale]}" added successfully.`);

        onOpenChange(false);
      },
      onError: (validationErrors) => {
        if (!validationErrors) return;

        validationErrors.errors.forEach((error) => {
          form.setError(error.property, { message: error.messages[0] });
        });
      },
    });
  };

  return (
    <div>
      <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
        Add Brand
      </Button>

      <Modal
        title="Add Brand"
        description="Add a new brand to the platform to allow users to filter products by it."
        asChild
        {...modalDisclosure}
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
            Add Brand
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
