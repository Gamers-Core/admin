'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { paymentMethods, DiscountSchema } from '@/api';

import { Field, FieldError, FieldGroup } from '../ui';
import { Button } from '../Button';

export const DiscountPaymentMethods = () => {
  const form = useFormContext<DiscountSchema>();

  return (
    <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6">
      <h3 className="text-lg font-semibold">Payment Methods</h3>

      <FieldGroup className="flex flex-col gap-2">
        <Controller
          name="paymentMethods"
          control={form.control}
          render={({ field, fieldState }) => {
            const selected = field.value ?? [];

            const toggle = (method: (typeof paymentMethods)[number]) => {
              const next = selected.includes(method) ? selected.filter((m) => m !== method) : [...selected, method];

              field.onChange(next.length ? next : undefined);
            };

            return (
              <>
                <Field className="flex flex-row flex-wrap gap-2 items-center min-w-auto">
                  {paymentMethods.map((method) => (
                    <Button
                      key={method}
                      className="capitalize flex-1 h-10 max-w-none min-w-40 font-semibold text-base"
                      onClick={() => toggle(method)}
                      variant={selected.includes(method) ? 'default' : 'secondary'}
                    >
                      {method.replaceAll('_', ' ')}
                    </Button>
                  ))}
                </Field>

                <p className="text-xs text-muted-foreground">
                  {selected.length
                    ? 'Discount only applies to selected payment methods.'
                    : 'Applies to all payment methods.'}
                </p>

                {fieldState.invalid && (
                  <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                )}
              </>
            );
          }}
        />
      </FieldGroup>
    </section>
  );
};
