'use client';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DiscountSchema } from '@/api';

import { Field, FieldError, FieldGroup, InputGroup, InputGroupAddon, InputGroupText, Switch } from '../ui';
import { NumberInput } from '../NumberInput';

export const DiscountRestrictions = () => {
  const form = useFormContext<DiscountSchema>();

  return (
    <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6">
      <h3 className="text-lg font-semibold">Restrictions</h3>

      <div className="flex flex-col gap-4">
        <FieldGroup className="w-full flex lg:flex-row gap-4">
          <ToggleField
            label="Minimum Order Amount"
            onToggleChange={(isEnabled) => {
              form.setValue('minOrderAmount', isEnabled ? 1 : undefined, { shouldValidate: true });
            }}
            initialValue={!!form.getValues('minOrderAmount')}
          >
            <Controller
              name="minOrderAmount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <InputGroup className="gap-2 h-10">
                    <NumberInput
                      id="min_price"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(value) => field.onChange(Math.max(Number(value), 0))}
                      className="sm:text-base md:text-base bg-transparent! border-0 focus-visible:[box-shadow:0_0_0_0px_transparent]!"
                    />

                    <InputGroupAddon align="inline-end">
                      <InputGroupText className="text-base">EGP</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError className="text-xs/normal md:text-xs/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </ToggleField>

          <ToggleField
            label="Maximum Discount Amount"
            onToggleChange={(isEnabled) => {
              form.setValue('maxDiscountAmount', isEnabled ? 1 : undefined, { shouldValidate: true });
            }}
            initialValue={!!form.getValues('maxDiscountAmount')}
          >
            <Controller
              name="maxDiscountAmount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <InputGroup className="gap-2 h-10">
                    <NumberInput
                      id="min_price"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(value) => field.onChange(Math.max(Number(value), 0))}
                      className="sm:text-base md:text-base bg-transparent! border-0 focus-visible:[box-shadow:0_0_0_0px_transparent]!"
                    />

                    <InputGroupAddon align="inline-end">
                      <InputGroupText className="text-base">EGP</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError className="text-xs/normal md:text-xs/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </ToggleField>
        </FieldGroup>

        <FieldGroup className="w-full flex lg:flex-row gap-4">
          <ToggleField
            label="Usage Limit"
            onToggleChange={(isEnabled) => {
              form.setValue('usageLimit', isEnabled ? 1 : undefined, { shouldValidate: true });
            }}
            initialValue={!!form.getValues('usageLimit')}
          >
            <Controller
              name="usageLimit"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <NumberInput
                    className="sm:text-base md:text-base h-10"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    onChange={(value) => field.onChange(value)}
                    value={field.value ?? ''}
                  />

                  {fieldState.invalid && (
                    <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </ToggleField>

          <ToggleField
            label="Usage Limit Per User"
            onToggleChange={(isEnabled) => {
              form.setValue('usageLimitPerUser', isEnabled ? 1 : undefined, { shouldValidate: true });
            }}
            initialValue={!!form.getValues('usageLimitPerUser')}
          >
            <Controller
              name="usageLimitPerUser"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <NumberInput
                    className="sm:text-base md:text-base h-10"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    onChange={(value) => field.onChange(value)}
                    value={field.value ?? ''}
                  />

                  {fieldState.invalid && (
                    <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </ToggleField>
        </FieldGroup>
      </div>
    </section>
  );
};

interface ToggleFieldFieldProps {
  label: string;
  children: React.ReactNode;
  onToggleChange?: (isEnabled: boolean) => void;
  initialValue?: boolean;
}

const ToggleField = ({ label, children, onToggleChange, initialValue = false }: ToggleFieldFieldProps) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-semibold">{label}</label>

        <Switch
          checked={isEnabled}
          onCheckedChange={(value) => {
            setIsEnabled(value);

            onToggleChange?.(value);
          }}
        />
      </div>

      {isEnabled && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  );
};
