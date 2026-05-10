'use client';

import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

interface FormProps<T extends FieldValues> extends UseFormReturn<T> {
  onSubmit: (data: T) => void;
  children?: React.ReactNode;
  className?: string;
}

export const Form = <T extends FieldValues>({ onSubmit, children, className, ...form }: FormProps<T>) => (
  <FormProvider {...form}>
    <form className={className} onSubmit={form.handleSubmit(onSubmit, console.warn)}>
      {children}
    </form>
  </FormProvider>
);
