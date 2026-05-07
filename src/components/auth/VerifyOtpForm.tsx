'use client';

import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { useVerifyOTPMutation, useCounter, useResendOTPMutation } from '@/hooks';
import { verifyOTPSchema, VerifyOTPSchema } from '@/api';
import { Button, Field, FieldError, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components';
import { useAuthStore } from '@/stores';

const defaultValues: VerifyOTPSchema = {
  otp: '',
};

interface VerifyOTPFormProps {
  sessionId: string;
  from?: string;
}

export const VerifyOTPForm = ({ sessionId, from }: VerifyOTPFormProps) => {
  const form = useForm<VerifyOTPSchema>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(verifyOTPSchema),
  });
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const verifyOTPMutation = useVerifyOTPMutation();
  const resendOTPMutation = useResendOTPMutation();

  const resendCounter = useCounter({
    duration: 30,
    onComplete: resendOTPMutation.reset,
  });

  const onSubmit: SubmitHandler<VerifyOTPSchema> = async (data) => {
    if (!form.formState.isValid || verifyOTPMutation.isPending) return;

    verifyOTPMutation.mutate(
      { ...data, sessionId },
      {
        onSuccess: async (res) => {
          switch (res.purpose) {
            case 'admin_signin':
              setUser(res.user);

              if (!res) toast.success('OTP verified successfully. Redirecting...');

              router.push(from ?? '/');
              break;
          }
        },
        onError: (error) => {
          if (!error) return;

          error.errors.forEach((err) => {
            form.setError(err.property, { message: err.messages[0] });
          });
        },
      },
    );
  };

  const onResendOTP = () => {
    resendCounter.start();

    resendOTPMutation.mutate(
      { sessionId },
      {
        onSuccess: () => {
          toast.success('OTP resent successfully.');
        },
      },
    );
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit, console.warn)}>
      <Controller
        name="otp"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex flex-col gap-2">
            <InputOTP
              maxLength={6}
              inputMode="numeric"
              pattern={REGEXP_ONLY_DIGITS}
              containerClassName="flex justify-center w-full"
              {...field}
            >
              <InputOTPGroup className="text-lg flex-1">
                <InputOTPSlot className="flex-1 h-12 text-xl" index={0} />
                <InputOTPSlot className="flex-1 h-12 text-xl" index={1} />
                <InputOTPSlot className="flex-1 h-12 text-xl" index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="flex-1">
                <InputOTPSlot className="flex-1 h-12 text-xl" index={3} />
                <InputOTPSlot className="flex-1 h-12 text-xl" index={4} />
                <InputOTPSlot className="flex-1 h-12 text-xl" index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className="flex justify-between">
              <FieldError className="flex items-center" errors={[fieldState.error]} />

              <Button
                variant="outline"
                type="button"
                className="text-primary-500 small-semibold ms-auto self-end py-1 px-2 h-auto"
                isDisabled={resendCounter.isActive}
                onClick={onResendOTP}
              >
                {resendCounter.isActive ? `Resend OTP in ${resendCounter.count}s` : 'Resend OTP'}
              </Button>
            </div>
          </Field>
        )}
      />

      <Button
        type="submit"
        variant="default"
        className="w-full h-auto py-2 text-lg"
        isDisabled={!form.formState.isValid || verifyOTPMutation.isSuccess}
        isLoading={verifyOTPMutation.isPending}
      >
        Verify OTP
      </Button>
    </form>
  );
};
