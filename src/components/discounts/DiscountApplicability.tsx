'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { defaultLocale, DiscountSchema, discountTargets, Media as MediaType } from '@/api';
import { useDisclosure } from '@/hooks';

import { Field, FieldError, FieldGroup } from '../ui';
import { Button } from '../Button';
import { ProductPreviewCard, ProductVariantsModal } from '../products';
import { BrandSelectModal } from '../brands';
import { CategorySelectModal } from '../categories';
import { Media } from '../Media';

export const DiscountApplicability = () => {
  const variantsDisclosure = useDisclosure();
  const brandsDisclosure = useDisclosure();
  const categoriesDisclosure = useDisclosure();

  const form = useFormContext<DiscountSchema>();

  const selectedTarget = form.watch('target');

  return (
    <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6">
      <h3 className="text-lg font-semibold">Applicability</h3>

      <FieldGroup className="flex flex-col gap-2">
        <Controller
          name="target"
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-row flex-wrap gap-2 items-center min-w-auto">
              {discountTargets.map((target) => (
                <Button
                  key={target}
                  className="capitalize flex-1 h-10 max-w-none min-w-40 font-semibold text-base"
                  onClick={() => {
                    field.onChange(target);

                    form.setValue('variants', undefined, { shouldValidate: true, shouldDirty: true });
                    form.setValue('categories', undefined, { shouldValidate: true, shouldDirty: true });
                    form.setValue('brands', undefined, { shouldValidate: true, shouldDirty: true });
                  }}
                  variant={field.value === target ? 'default' : 'secondary'}
                >
                  {target.replaceAll('_', ' ')}
                </Button>
              ))}
            </Field>
          )}
        />

        {selectedTarget === 'product' && (
          <Controller
            name="variants"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <Button variant="secondary" onClick={variantsDisclosure.onOpen} className="min-h-28 min-w-full h-auto">
                  Select Variants
                </Button>

                {field.value?.map((variant) => (
                  <ProductPreviewCard key={variant.id} variant={variant} />
                ))}

                <ProductVariantsModal
                  mode="multiple"
                  canSelectInactive
                  canSelectOutOfStock
                  variantIds={field.value?.map(({ id }) => id)}
                  onVariantSelect={(variants) => field.onChange(variants)}
                  {...variantsDisclosure}
                />

                {fieldState.invalid && (
                  <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        {selectedTarget === 'category' && (
          <Controller
            name="categories"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <Button
                  variant="secondary"
                  onClick={categoriesDisclosure.onOpen}
                  className="min-h-28 min-w-full h-auto"
                >
                  Select Categories
                </Button>

                {field.value?.map((category) => (
                  <OptionCard key={category.id} title={category.name[defaultLocale]} />
                ))}

                <CategorySelectModal
                  mode="multiple"
                  categoryIds={field.value?.map(({ id }) => id)}
                  onCategoriesSelect={(categories) => field.onChange(categories)}
                  {...categoriesDisclosure}
                />

                {fieldState.invalid && (
                  <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        {selectedTarget === 'brand' && (
          <Controller
            name="brands"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <Button variant="secondary" onClick={brandsDisclosure.onOpen} className="min-h-28 min-w-full h-auto">
                  Select Brands
                </Button>

                {field.value?.map((brand) => (
                  <OptionCard key={brand.id} title={brand.name[defaultLocale]} image={brand.image} />
                ))}

                <BrandSelectModal
                  mode="multiple"
                  brandIds={field.value?.map(({ id }) => id)}
                  onBrandsSelect={(brands) => field.onChange(brands)}
                  {...brandsDisclosure}
                />

                {fieldState.invalid && (
                  <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
      </FieldGroup>
    </section>
  );
};

interface OptionCardProps {
  title: string;
  image?: MediaType<'image'> | null;
}

const OptionCard = ({ title, image }: OptionCardProps) => (
  <div className="flex items-center gap-4 border rounded-lg shadow-sm p-4">
    {!!image && (
      <div className="size-12 shrink-0">
        <Media media={image} alt={title} className="w-full aspect-square object-cover overflow-hidden rounded-full" />
      </div>
    )}

    <h3 className="font-medium text-sm truncate min-w-0 flex-1">{title}</h3>
  </div>
);
