'use client';

import { useFormContext, Controller, FieldPath } from 'react-hook-form';

import { defaultLocale, localeDir, locales, Localized } from '@/api';
import { cn } from '@/lib/utils';

import { Field, FieldError, FieldLabel, Input, Textarea } from './ui';
import { RichTextInput } from './rich-text-input';

type LocalizedFields<T> = {
  [K in keyof T]: T[K] extends Localized ? K : never;
}[keyof T];

type FormType = 'input' | 'textarea' | 'richtext';

interface LocalizedFormProps<T extends Record<string, unknown>> {
  name: LocalizedFields<T> & string;
  type?: FormType;
  className?: string;
}

export const LocalizedForm = <T extends Record<string, unknown>>({
  name,
  type = 'input',
  className,
}: LocalizedFormProps<T>) => {
  const form = useFormContext<T>();

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {locales.map((locale) => {
        const fieldName = `${name}.${locale}` as FieldPath<T>;
        const id = `${name}-${locale}`;
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
                <Field>
                  <FieldLabel htmlFor={id} className="text-sm text-foreground flex gap-1">
                    <span className="capitalize">{name}</span>
                    <span className="uppercase">({locale})</span>
                    {isRequired && <span className="text-destructive">*</span>}
                  </FieldLabel>

                  <Component
                    id={id}
                    dir={dir}
                    className={cn('w-full', {
                      'font-cairo': dir === 'rtl',
                      'p-2 px-3 text-sm/relaxed md:text-base/relaxed': type !== 'richtext',
                    })}
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
