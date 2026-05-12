'use client';

import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { BackendError, UserReview, userReviewSchema, UserReviewSchema, ValidationErrors } from '@/api';
import { Disclosure, useAddUserReviewMutation, useUpdateUserReviewMutation } from '@/hooks';
import { useUploadMediaStore } from '@/stores';

import { Form } from '../Form';
import { Button } from '../Button';
import { Modal, ModalFooter } from '../Modal';
import { Field, FieldError, FieldLabel, Input } from '../ui';
import { UploadMedia } from '../UploadMedia';

interface UserReviewFormModalProps {
  userReview?: UserReview;
  disclosure: Disclosure;
}

const defaultValues: UserReviewSchema = {
  imageId: null,
  facebookURL: '',
} as unknown as UserReviewSchema;

export const UserReviewFormModal = ({ userReview, disclosure }: UserReviewFormModalProps) => {
  const form = useForm<UserReviewSchema>({
    defaultValues: userReview ? { imageId: userReview.image?.id, facebookURL: userReview.facebookURL } : defaultValues,
    mode: 'onChange',
    resolver: zodResolver(userReviewSchema),
  });

  const isUploading = useUploadMediaStore((state) => state.files.some((f) => f.state === 'uploading'));
  const updateUserReviewMutation = useUpdateUserReviewMutation();
  const addUserReviewMutation = useAddUserReviewMutation();

  const isLoading = updateUserReviewMutation.isPending || addUserReviewMutation.isPending;

  useEffect(() => {
    if (!disclosure.open) return;

    form.reset(userReview ? { imageId: userReview.image?.id, facebookURL: userReview.facebookURL } : defaultValues);
  }, [userReview, disclosure.open, form]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      updateUserReviewMutation.reset();
      addUserReviewMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<UserReviewSchema> = async (data) => {
    if (!form.formState.isValid || isLoading) return;

    const onSuccess = () => {
      toast.success(`UserReview ${userReview ? 'updated' : 'added'} successfully.`);

      onOpenChange(false);
    };

    const onError = (validationErrors: BackendError<ValidationErrors<keyof UserReviewSchema>> | null) => {
      if (!validationErrors) return;

      validationErrors.errors.forEach((error) => {
        form.setError(error.property, { message: error.messages[0] });
      });
    };

    if (userReview)
      return updateUserReviewMutation.mutate({ ...data, position: userReview.position }, { onSuccess, onError });

    addUserReviewMutation.mutate(data, { onSuccess, onError });
  };

  return (
    <Modal
      title={userReview ? `Update UserReview ${userReview.position}` : 'Add New UserReview'}
      description={userReview ? `Update the userReview ${userReview.position} information.` : 'Add a new user review.'}
      asChild
      {...disclosure}
      onOpenChange={onOpenChange}
    >
      <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onSubmit} {...form}>
        <div className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto">
          <Controller
            name="imageId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <UploadMedia folder="userReview" onSuccess={([{ id }]) => field.onChange(id)} />

                {fieldState.invalid && (
                  <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="facebookURL"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="facebookURL" className="text-sm text-foreground flex">
                  Facebook URL
                </FieldLabel>

                <Input
                  id="facebookURL"
                  type="url"
                  autoComplete="url"
                  placeholder="https://www.facebook.com/review"
                  dir="ltr"
                  className="w-full p-2 px-3 text-sm/relaxed md:text-base/relaxed"
                  {...field}
                />

                {fieldState.invalid && (
                  <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                )}
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
              !form.formState.isValid ||
              addUserReviewMutation.isSuccess ||
              updateUserReviewMutation.isSuccess ||
              isUploading
            }
            isLoading={isLoading}
          >
            {userReview ? 'Update' : 'Add'} UserReview
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
