'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { ProductSchema, productStatuses } from '@/api';
import {
  Field,
  FieldError,
  FieldLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';

export const ProductStatusSelectMenu = () => {
  const form = useFormContext<ProductSchema>();

  return (
    <Controller
      name="status"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor="status" className="text-lg font-semibold">
            Status
          </FieldLabel>

          <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
            <SelectTrigger className="w-full text-sm capitalize">
              <SelectValue placeholder={field.value} />
            </SelectTrigger>

            <SelectContent position="popper">
              <SelectGroup>
                {productStatuses.map((status) => (
                  <SelectItem key={status} value={status} className="capitalize text-sm">
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {fieldState.invalid && (
            <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
