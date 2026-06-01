'use client';

import { useFormContext, Controller, FieldPath } from 'react-hook-form';

import { defaultLocale, localeDir, locales, Localized } from '@/api';
import { cn } from '@/lib/utils';

import { Field, FieldError, FieldLabel, Input, Textarea } from './ui';
import { RichTextInput } from './rich-text-input';
import { useId } from 'react';

type LocalizedFields<T> = {
  [K in keyof T]: T[K] extends Localized ? K : never;
}[keyof T];

type FormType = 'input' | 'textarea' | 'richtext';

interface LocalizedFormProps<T extends Record<string, unknown>> {
  name: (LocalizedFields<T> & string) | (string & {});
  type?: FormType;
  className?: string;
  hideLabel?: boolean;
}

export const LocalizedForm = <T extends Record<string, unknown>>({
  name,
  type = 'input',
  className,
  hideLabel = false,
}: LocalizedFormProps<T>) => {
  const form = useFormContext<T>();

  const fieldId = useId();

  return (
    <div className={cn('flex flex-col gap-4 text-sm', className)}>
      {locales.map((locale) => {
        const fieldName = `${name}.${locale}` as FieldPath<T>;
        const id = `${name}-${locale}-${fieldId}`;
        const isRequired = locale === defaultLocale;
        const dir = localeDir[locale];

        const Component = type === 'input' ? Input : type === 'textarea' ? Textarea : RichTextInput;

        return (
          <Controller
            key={locale}
            name={fieldName}
            control={form.control}
            render={({ field, fieldState }) => {
              const inputProps = { ...field, value: (field.value ?? '') as string };

              return (
                <Field className={cn({ 'gap-0': hideLabel })}>
                  {!hideLabel && (
                    <FieldLabel htmlFor={id} className="text-foreground flex gap-1 [font-size:inherit]">
                      <span className="capitalize">{name}</span>
                      <span className="uppercase">({locale})</span>
                      {isRequired && <span className="text-destructive">*</span>}
                    </FieldLabel>
                  )}

                  <Component
                    id={id}
                    dir={dir}
                    placeholder={hideLabel ? locale : undefined}
                    className={cn('w-full', {
                      'font-cairo': dir === 'rtl',
                      'p-2 px-3 text-sm/relaxed md:text-base/relaxed': type !== 'richtext',
                    })}
                    locale={locale}
                    {...inputProps}
                  />

                  {fieldState.invalid && (
                    <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        );
      })}
    </div>
  );
};
