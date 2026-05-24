'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';

import { Form } from '@/components';
import { productSchema, ProductSchema, defaultLocalizedValue, Product } from '@/api';

interface ProductFormProps {
  children: React.ReactNode;
  className?: string;
  product?: Product;
}

const defaultValues: ProductSchema = {
  name: defaultLocalizedValue,
  title: defaultLocalizedValue,
  description: defaultLocalizedValue,
  status: 'draft',
  variants: [],
  media: [],
  brandId: null as unknown as number,
  categoryId: null as unknown as number,
};

export const ProductForm = ({ product, ...props }: ProductFormProps) => {
  const values = useMemo(() => (product ? mapProductToSchema(product) : defaultValues), [product]);

  const form = useForm<ProductSchema>({
    defaultValues: values,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(productSchema),
    shouldUnregister: false,
  });

  useEffect(() => {
    if (!product) return;

    form.trigger();
  }, [form, product]);

  return <Form {...form} {...props} />;
};

const mapProductToSchema = ({ brand, category, variants, ...product }: Product): ProductSchema => ({
  ...product,
  brandId: brand?.id ?? (null as unknown as number),
  categoryId: category?.id ?? (null as unknown as number),
  variants: variants.map(({ compareAt, ...variant }) => ({
    ...variant,
    imageId: variant.image.id,
    compareAt: compareAt ?? 0,
  })),
});
