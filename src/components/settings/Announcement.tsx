'use client';

import { Controller, SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { AppSettings, appSettingsSchemas, AppSettingsSchemas, localeDir, locales } from '@/api';
import { Disclosure, useAppSettingQuery, useDisclosure, useFormatDate, useSetAppSettingsMutation } from '@/hooks';
import { cn } from '@/lib/utils';

import { Button } from '../Button';
import { Modal, ModalFooter } from '../Modal';
import { Form } from '../Form';
import { Field, FieldError, FieldLabel, FieldTitle, Switch } from '../ui';
import { LocalizedForm } from '../LocalizedForm';
import { DateTimeSelector } from '../DateTimeSelector';
import { ReorderedMediaUpload } from '../ReorderedMediaUpload';
import { HTMLRender } from '../HTMLRender';

export const Announcement = (props: AppSettings['announcement']) => {
  const disclosure = useDisclosure();
  const formatDate = useFormatDate();

  const announcementQuery = useAppSettingQuery('announcement');

  const data = announcementQuery.data ?? props;

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Announcement</h2>

              <p className="text-sm text-muted-foreground">{data.enabled ? 'Enabled' : 'Disabled'}</p>
            </div>

            <Button onClick={disclosure.onOpen}>Configure</Button>
          </div>

          {data.enabled && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {locales.map(
                  (locale) =>
                    data.message[locale] && (
                      <div key={locale}>
                        <p className="text-sm text-muted-foreground capitalize">{locale}</p>

                        <div
                          key={locale}
                          dir={localeDir[locale]}
                          className={cn('text-sm text-muted-foreground text-start w-full line-clamp-2', {
                            'font-cairo': localeDir[locale] === 'rtl',
                          })}
                        >
                          <AnnouncementMessageHTML html={data.message[locale]} />
                        </div>
                      </div>
                    ),
                )}
              </div>

              {data.disableAt && (
                <div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disable at</p>

                    <p>{formatDate(data.disableAt, "MMM d, yyyy 'at' h:mma")}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <AnnouncementModal announcement={data} {...disclosure} />
    </>
  );
};

const AnnouncementMessageHTML = HTMLRender('AnnouncementMessage');

interface AnnouncementModalProps extends Disclosure {
  announcement: AppSettingsSchemas['announcement'];
}

const defaultValues: AppSettingsSchemas['announcement'] = {
  enabled: false,
  message: {
    en: '',
    ar: '',
  },
  disableAt: null,
};

export const AnnouncementModal = ({ announcement, ...disclosure }: AnnouncementModalProps) => {
  const form = useForm<AppSettingsSchemas['announcement']>({
    defaultValues,
    resolver: zodResolver(appSettingsSchemas.announcement),
    mode: 'onChange',
  });
  const { isDirty } = useFormState({ control: form.control });

  const setAnnouncementMutation = useSetAppSettingsMutation('announcement');

  const onOpenChange = (open: boolean) => {
    if (setAnnouncementMutation.isPending) return;

    if (!open) {
      form.reset(defaultValues);
      setAnnouncementMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  useEffect(() => {
    if (!disclosure.open) return;

    form.reset(announcement);
  }, [disclosure.open, announcement, form]);

  const onSubmit: SubmitHandler<AppSettingsSchemas['announcement']> = async (data) => {
    if (setAnnouncementMutation.isPending) return;

    await setAnnouncementMutation.mutateAsync(
      { ...data, message: data.message },
      {
        onSuccess: () => {
          toast.success('Announcement configuration updated successfully.');

          onOpenChange(false);
        },
        onError: (validationErrors) => {
          if (!validationErrors) return;

          validationErrors.errors.forEach((error) => {
            form.setError(error.property, { message: error.messages[0] });
          });

          toast.error('Please review the form and fix the errors before submitting again.');
        },
      },
    );
  };

  const enabled = form.watch('enabled');

  return (
    <Modal
      title="Configure Announcement"
      description="Control announcement and the message shown to users."
      {...disclosure}
      onOpenChange={onOpenChange}
    >
      <Form {...form} onSubmit={onSubmit} className="flex-1 flex flex-col gap-5">
        <Controller
          name="enabled"
          control={form.control}
          render={({ field }) => (
            <FieldLabel htmlFor="announcement-enabled">
              <Field orientation="horizontal">
                <FieldTitle className="text-base font-medium">Enable announcement</FieldTitle>

                <Switch checked={field.value} onCheckedChange={field.onChange} id="announcement-enabled" />
              </Field>
            </FieldLabel>
          )}
        />

        {enabled && (
          <>
            <ReorderedMediaUpload folder="announcement" className="p-4 md:p-0" />

            <div>
              <LocalizedForm<AppSettingsSchemas['announcement']> name="message" type="richtext" />

              <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[form.formState.errors.message]} />
            </div>

            <Controller
              name="disableAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <DateTimeSelector
                    value={field.value ?? undefined}
                    onChange={(date) => {
                      if (!date) return form.setValue('disableAt', null, { shouldValidate: true });

                      field.onChange(date.toISOString());
                    }}
                  />

                  <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                </>
              )}
            />
          </>
        )}

        <ModalFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full h-auto py-2 text-lg"
            isLoading={setAnnouncementMutation.isPending}
            isDisabled={!isDirty}
          >
            Save Configuration
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
