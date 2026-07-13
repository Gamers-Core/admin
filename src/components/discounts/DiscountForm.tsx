'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Discount, DiscountSchema, discountSchema } from '@/api';
import { Form } from '@/components';

interface DiscountFormProps {
  children: React.ReactNode;
  className?: string;
  discount?: Discount;
}

const defaultValues: DiscountSchema = {
  method: 'code',
  target: 'order',
  valueType: 'percentage',
  eligibility: 'all_users',
  isActive: true,
  value: 1,
};

export const DiscountForm = ({ discount, ...props }: DiscountFormProps) => {
  const values = useMemo(() => (discount ? mapDiscountToSchema(discount) : defaultValues), [discount]);

  const form = useForm<DiscountSchema>({
    defaultValues: values,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(discountSchema),
    shouldUnregister: false,
  });

  useEffect(() => {
    if (!discount) return;
    form.trigger();
  }, [form, discount]);

  return <Form {...form} {...props} />;
};

const mapDiscountToSchema = (discount: Discount): DiscountSchema => ({
  ...discount,
  code: discount.code ?? undefined,
  valueType: discount.valueType ?? defaultValues.valueType,
  value: discount.value ?? defaultValues.value,
  minOrderAmount: discount.minOrderAmount ?? undefined,
  maxDiscountAmount: discount.maxDiscountAmount ?? undefined,
  usageLimit: discount.usageLimit ?? undefined,
  usageLimitPerUser: discount.usageLimitPerUser ?? undefined,
  startsAt: discount.startsAt ?? undefined,
  expiresAt: discount.expiresAt ?? undefined,
});
