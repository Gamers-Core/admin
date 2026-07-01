'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { DiscountSchema } from '@/api';

import { Field, FieldError, FieldLabel, Switch } from '../ui';
import { DateTimeSelector } from '../DateTimeSelector';

export const DiscountStatus = () => {
  const form = useFormContext<DiscountSchema>();

  return (
    <section className="md:sticky md:top-4 md:self-start min-w-0 flex-1 bg-sidebar p-4 rounded-lg gap-4 grid grid-cols-1">
      <Controller
        name="isActive"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex flex-row items-center">
            <FieldLabel htmlFor="isActive" className="text-lg font-semibold">
              Active
            </FieldLabel>

            <Switch checked={field.value} onCheckedChange={field.onChange} id="isActive" />

            {fieldState.invalid && (
              <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Controller
        name="startsAt"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="startsAt" className="text-lg font-semibold">
              Starts At
            </FieldLabel>

            <DateTimeSelector
              forceOrientation="vertical"
              value={field.value ?? undefined}
              onChange={(date) => {
                if (!date) return form.setValue('startsAt', undefined, { shouldValidate: true });

                field.onChange(date.toISOString());
              }}
            />

            {fieldState.invalid && (
              <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Controller
        name="expiresAt"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="expiresAt" className="text-lg font-semibold">
              Expires At
            </FieldLabel>

            <DateTimeSelector
              forceOrientation="vertical"
              value={field.value ?? undefined}
              onChange={(date) => {
                if (!date) return form.setValue('expiresAt', undefined, { shouldValidate: true });

                field.onChange(date.toISOString());
              }}
            />

            {fieldState.invalid && (
              <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </section>
  );
};
