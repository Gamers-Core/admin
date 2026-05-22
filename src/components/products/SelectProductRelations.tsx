'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { ProductSchema, defaultLocale } from '@/api';
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
import { useBrandsQuery, useCategoriesQuery } from '@/hooks';

export const SelectProductRelations = () => {
  const form = useFormContext<ProductSchema>();

  const brandsQuery = useBrandsQuery();
  const categoriesQuery = useCategoriesQuery();

  return (
    <>
      {brandsQuery.data && (
        <Controller
          name="brandId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="brandId" className="text-lg font-semibold">
                Brand
              </FieldLabel>

              <Select
                value={field.value != null ? String(field.value) : ''}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger className="w-full text-sm capitalize">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectGroup>
                    {brandsQuery.data?.map((brand) => (
                      <SelectItem key={brand.id} value={String(brand.id)} className="capitalize text-sm">
                        {brand.name[defaultLocale]}
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
      )}

      <Controller
        name="categoryId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="categoryId" className="text-lg font-semibold">
              Category
            </FieldLabel>

            <Select
              value={field.value != null ? String(field.value) : ''}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger className="w-full text-sm capitalize">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>

              <SelectContent position="popper">
                <SelectGroup>
                  {categoriesQuery.data?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)} className="capitalize text-sm">
                      {category.name[defaultLocale]}
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
    </>
  );
};
