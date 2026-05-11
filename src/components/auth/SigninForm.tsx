'use client';

import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { SigninSchema, signinSchema } from '@/api';
import { Button, Field, FieldError, FieldLabel, Form, Input } from '@/components';
import { useAdminSigninMutation } from '@/hooks';

const defaultValues: SigninSchema = {
  email: '',
};

interface SigninFormProps {
  from?: string;
}

export const SigninForm = ({ from }: SigninFormProps) => {
  const router = useRouter();
  const form = useForm<SigninSchema>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(signinSchema),
  });

  const signinMutation = useAdminSigninMutation();

  const onSubmit: SubmitHandler<SigninSchema> = async (data) => {
    if (!form.formState.isValid || signinMutation.isPending) return;

    signinMutation.mutate(data, {
      onSuccess: ({ sessionId }) => {
        toast.success('OTP sent to your email. Please check your inbox.');

        const params = new URLSearchParams({ sessionId });
        if (from) params.append('from', from);
        router.push(`/verify-otp` + `?${params.toString()}`);
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
    <Form className="flex flex-col gap-5" onSubmit={onSubmit} {...form}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="email" className="text-base md:text-xl text-foreground">
              Email
            </FieldLabel>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              dir="ltr"
              className="w-full min-h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed text-left"
              {...field}
            />

            {fieldState.invalid && (
              <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Button
        type="submit"
        variant="default"
        className="w-full h-auto py-2 text-lg"
        isDisabled={!form.formState.isValid || signinMutation.isSuccess}
        isLoading={signinMutation.isPending}
      >
        Sign In
      </Button>
    </Form>
  );
};
