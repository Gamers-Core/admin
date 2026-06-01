'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  BackendError,
  FeaturedVariant,
  featuredVariantSchema,
  FeaturedVariantSchema,
  ValidationErrors,
  defaultLocalizedValue,
  VariantWithProduct,
} from '@/api';
import { Disclosure, useAddFeaturedVariantMutation, useDisclosure, useUpdateFeaturedVariantMutation } from '@/hooks';
import { cn } from '@/lib/utils';

import { Form } from '../Form';
import { LocalizedForm } from '../LocalizedForm';
import { Button } from '../Button';
import { Modal, ModalFooter } from '../Modal';
import { Field, FieldError } from '../ui';
import { ProductPreviewCard, ProductVariantsModal } from '../products';

interface FeaturedVariantFormModalProps {
  featuredVariant?: FeaturedVariant;
  disclosure: Disclosure;
}

export const FeaturedVariantFormModal = ({ featuredVariant, disclosure }: FeaturedVariantFormModalProps) => {
  const [variant, setVariant] = useState<VariantWithProduct | null>(featuredVariant?.variant ?? null);

  const defaultValues = useMemo(() => {
    if (!featuredVariant) return { variantId: null as unknown as number, title: defaultLocalizedValue };

    return { variantId: featuredVariant.variant.id, title: featuredVariant.title };
  }, [featuredVariant]);

  const form = useForm<FeaturedVariantSchema>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(featuredVariantSchema),
  });

  const updateFeaturedVariantMutation = useUpdateFeaturedVariantMutation();
  const addFeaturedVariantMutation = useAddFeaturedVariantMutation();

  const productVariantsModalDisclosure = useDisclosure();

  const isLoading = updateFeaturedVariantMutation.isPending || addFeaturedVariantMutation.isPending;

  useEffect(() => {
    if (!disclosure.open) return;

    form.reset(defaultValues);
  }, [disclosure.open, form, defaultValues]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      updateFeaturedVariantMutation.reset();
      addFeaturedVariantMutation.reset();
      setVariant(null);
    }

    disclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<FeaturedVariantSchema> = async (data) => {
    if (!form.formState.isValid || isLoading) return;

    const onSuccess = (data: FeaturedVariant) => {
      toast.success(`Featured variant ${featuredVariant ? 'updated' : 'added'} successfully.`);

      setVariant(data.variant);

      onOpenChange(false);
    };

    const onError = (validationErrors: BackendError<ValidationErrors<keyof FeaturedVariantSchema>> | null) => {
      if (!validationErrors) return;

      validationErrors.errors.forEach((error) => {
        form.setError(error.property, { message: error.messages[0] });
      });
    };

    if (featuredVariant)
      return updateFeaturedVariantMutation.mutate({ ...data, id: featuredVariant.id }, { onSuccess, onError });

    addFeaturedVariantMutation.mutate(data, { onSuccess, onError });
  };

  return (
    <Modal
      title={featuredVariant ? `Update featured variant ${featuredVariant.position}` : 'Add New featured variant'}
      description={
        featuredVariant
          ? `Update the featured variant ${featuredVariant.position} information.`
          : 'Add a new featured variant to the list of featured variants.'
      }
      asChild
      {...disclosure}
      onOpenChange={onOpenChange}
    >
      <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onSubmit} {...form}>
        <div className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto">
          <LocalizedForm<FeaturedVariantSchema> name="title" />

          <Controller
            name="variantId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1">
                <div className={cn('relative min-h-28 min-w-full', { 'min-h-0': !!variant })}>
                  {!!variant && <ProductPreviewCard variant={variant!} />}

                  <Button
                    variant="secondary"
                    onClick={productVariantsModalDisclosure.onOpen}
                    className={cn('absolute inset-0 h-auto', { 'opacity-0 hover:opacity-100': !!variant })}
                  >
                    Select Variant
                  </Button>
                </div>

                {fieldState.invalid && (
                  <FieldError className="text-sm/normal lg:text-sm/relaxed" errors={[fieldState.error]} />
                )}

                <ProductVariantsModal
                  {...productVariantsModalDisclosure}
                  mode="single"
                  variantIds={field.value ? [field.value] : undefined}
                  onVariantSelect={([variant]) => {
                    field.onChange(variant.id);
                    setVariant(variant);
                  }}
                  canSelectInactive
                  canSelectOutOfStock
                />
              </Field>
            )}
          />
        </div>

        <ModalFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full h-auto py-2 text-lg"
            isDisabled={
              !form.formState.isValid || addFeaturedVariantMutation.isSuccess || updateFeaturedVariantMutation.isSuccess
            }
            isLoading={isLoading}
          >
            {featuredVariant ? 'Update' : 'Add'} featured variant
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
