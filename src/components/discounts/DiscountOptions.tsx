'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { discountMethods, DiscountSchema, discountValueTypes } from '@/api';
import { Button } from '../Button';
import { Field, FieldError, FieldGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from '../ui';
import { NumberInput } from '../NumberInput';

export const DiscountOptions = () => {
  const form = useFormContext<DiscountSchema>();

  const method = form.watch('method');
  const valueType = form.watch('valueType');
  const isFreeShipping = form.watch('target') === 'free_shipping';

  return (
    <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6">
      <FieldGroup className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Discount Method</h2>

        <Controller
          name="method"
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-row gap-2 items-center min-w-auto">
              {discountMethods.map((method) => (
                <Button
                  key={method}
                  className="capitalize flex-1 h-10 font-semibold text-base"
                  onClick={() => field.onChange(method)}
                  variant={field.value === method ? 'default' : 'secondary'}
                >
                  {method}
                </Button>
              ))}
            </Field>
          )}
        />

        {method === 'code' && (
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <Input
                  className="sm:text-base md:text-base h-10"
                  placeholder="code"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase().trim())}
                  value={field.value ?? ''}
                />

                {fieldState.invalid && (
                  <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
      </FieldGroup>

      {!isFreeShipping && (
        <FieldGroup className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Value</h2>

          <Controller
            name="valueType"
            control={form.control}
            render={({ field }) => (
              <Field className="flex flex-row gap-2 items-center min-w-auto">
                {discountValueTypes.map((valueType) => (
                  <Button
                    key={valueType}
                    className="capitalize flex-1 h-10 font-semibold text-base"
                    onClick={() => field.onChange(valueType)}
                    variant={field.value === valueType ? 'default' : 'secondary'}
                  >
                    {valueType.replaceAll('_', ' ')}
                  </Button>
                ))}
              </Field>
            )}
          />

          <Controller
            name="value"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="gap-2 h-10">
                  <NumberInput
                    id="value"
                    placeholder="0"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    value={Number(field.value) ?? ''}
                    onChange={(value) =>
                      field.onChange(
                        Math.max(valueType === 'percentage' ? Math.min(Number(value), 100) : Number(value), 0),
                      )
                    }
                    className="sm:text-base md:text-base bg-transparent! border-0 focus-visible:[box-shadow:0_0_0_0px_transparent]!"
                  />

                  <InputGroupAddon align="inline-end">
                    <InputGroupText className="text-base">
                      {valueType === 'percentage' ? '%' : valueType === 'fixed_amount' ? 'EGP' : ''}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError className="text-xs/normal md:text-xs/relaxed" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      )}
    </section>
  );
};
