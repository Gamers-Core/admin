'use client';

import { useRouter } from 'next/navigation';
import { SubmitHandler, useFormContext, useFormState } from 'react-hook-form';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { Trash } from '@hugeicons/core-free-icons';

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
import { Discount, DiscountSchema, BackendError, ValidationErrors } from '@/api';
import { useAddDiscountMutation, useUpdateDiscountMutation, useRemoveDiscountMutation } from '@/hooks';

interface DiscountFormCTAProps {
  discount?: Discount;
}

export const DiscountFormCTA = ({ discount }: DiscountFormCTAProps) => {
  const isEditMode = !!discount;

  const router = useRouter();
  const form = useFormContext<DiscountSchema>();
  const { isValid, isDirty } = useFormState({ control: form.control });

  const addDiscountMutation = useAddDiscountMutation();
  const updateDiscountMutation = useUpdateDiscountMutation();

  const isLoading = addDiscountMutation.isPending || updateDiscountMutation.isPending;

  const onSubmit: SubmitHandler<DiscountSchema> = async (data) => {
    if (isLoading) return;

    const onSuccess = () => {
      toast.success(`Discount ${isEditMode ? 'updated' : 'added'} successfully.`);
      router.push('/discounts');
    };

    const onError = (validationErrors: BackendError<ValidationErrors<keyof DiscountSchema>> | null) => {
      if (!validationErrors) return;

      validationErrors.errors.forEach((error) => {
        form.setError(error.property, { message: error.messages[0] });
      });

      toast.error('Please review the form and fix the errors before submitting again.');
    };

    if (isEditMode) return updateDiscountMutation.mutate({ id: discount.id, ...data }, { onSuccess, onError });

    addDiscountMutation.mutate(data, { onSuccess, onError });
  };

  const canSubmit = isDirty && isValid;

  return (
    <TopBarCTA>
      {canSubmit && (
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

      {isEditMode && <RemoveDiscount isDisabled={isLoading} {...discount} />}
    </TopBarCTA>
  );
};

interface RemoveDiscountProps extends Discount {
  isDisabled?: boolean;
}

const RemoveDiscount = ({ isDisabled, id, code, method }: RemoveDiscountProps) => {
  const router = useRouter();

  const removeDiscountMutation = useRemoveDiscountMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button isDisabled={isDisabled} variant="destructive" icon={<HugeiconsIcon icon={Trash} />} />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Discount</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove the{' '}
            {method === 'automatic' ? 'automatic discount' : <span className="font-mono font-semibold">{code}</span>}{' '}
            discount?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              removeDiscountMutation.mutate(id, {
                onSuccess: () => {
                  toast.success('Discount removed successfully.');

                  router.push('/discounts');
                },
              })
            }
          >
            Remove Discount
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
