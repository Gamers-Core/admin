'use client';

import { Controller, SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { BackendError, CreateUserSchema, ValidationErrors, createUserSchema } from '@/api';
import { Disclosure, useCreateUserMutation } from '@/hooks';

import { Form } from '../Form';
import { Button } from '../Button';
import { Modal, ModalFooter } from '../Modal';
import { Field, FieldError, FieldLabel, Input } from '../ui';

const defaultValues: CreateUserSchema = {
  name: '',
  email: '',
};

export const UserCreateModal = (disclosure: Disclosure) => {
  const form = useForm<CreateUserSchema>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(createUserSchema),
  });
  const { isValid, isDirty } = useFormState({ control: form.control });

  const createUserMutation = useCreateUserMutation();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultValues);
      createUserMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<CreateUserSchema> = async (data) => {
    if (!isValid || createUserMutation.isPending) return;

    await createUserMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success('User created successfully.');

        onOpenChange(false);
      },
      onError: (validationErrors: BackendError<ValidationErrors<keyof CreateUserSchema>> | null) => {
        if (!validationErrors) return;

        validationErrors.errors.forEach((error) => {
          form.setError(error.property, { message: error.messages[0] });
        });

        toast.error('Please review the form and fix the errors before submitting again.');
      },
    });
  };

  return (
    <Modal
      title="Create User"
      description="Create a new user by providing their name and email."
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
            isLoading={createUserMutation.isPending}
            isDisabled={!isValid || !isDirty}
          >
            Create User
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
