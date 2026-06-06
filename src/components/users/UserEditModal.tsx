'use client';

import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { BackendError, CreateUserSchema, FullUser, ValidationErrors, createUserSchema } from '@/api';
import { Disclosure, useUpdateUserMutation } from '@/hooks';

import { Form } from '../Form';
import { Button } from '../Button';
import { Modal, ModalFooter } from '../Modal';
import { Field, FieldError, FieldLabel, Input } from '../ui';

interface UserEditModalProps extends Disclosure {
  user: FullUser;
}

export const UserEditModal = ({ user, ...disclosure }: UserEditModalProps) => {
  const form = useForm<CreateUserSchema>({
    defaultValues: { name: user.name, email: user.email },
    mode: 'onChange',
    resolver: zodResolver(createUserSchema),
  });

  const updateUserMutation = useUpdateUserMutation();

  useEffect(() => {
    if (!disclosure.open) return;
    form.reset({ name: user.name, email: user.email });
  }, [disclosure.open, form, user.email, user.name]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({ name: user.name, email: user.email });
      updateUserMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<CreateUserSchema> = async (data) => {
    if (!form.formState.isValid || updateUserMutation.isPending) return;

    await updateUserMutation.mutateAsync(
      { id: user.id, ...data },
      {
        onSuccess: () => {
          toast.success('User updated successfully.');

          onOpenChange(false);
        },
        onError: (validationErrors: BackendError<ValidationErrors<keyof CreateUserSchema>> | null) => {
          if (!validationErrors) return;

          validationErrors.errors.forEach((error) => {
            form.setError(error.property, { message: error.messages[0] });
          });

          toast.error('Please review the form and fix the errors before submitting again.');
        },
      },
    );
  };

  return (
    <Modal
      title="Edit User"
      description="Update this user's name and email."
      asChild
      {...disclosure}
      onOpenChange={onOpenChange}
    >
      <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onSubmit} {...form}>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="name" className="text-sm font-semibold">
                Name
              </FieldLabel>

              <Input id="name" placeholder="Enter full name" {...field} />

              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email" className="text-sm font-semibold">
                Email
              </FieldLabel>

              <Input id="email" type="email" placeholder="Enter email address" {...field} />

              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <ModalFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full h-auto py-2 text-lg"
            isLoading={updateUserMutation.isPending}
            isDisabled={!form.formState.isValid || !form.formState.isDirty}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
