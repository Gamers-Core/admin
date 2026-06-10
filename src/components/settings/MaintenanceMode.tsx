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

export const MaintenanceMode = (props: AppSettings['maintenanceMode']) => {
  const disclosure = useDisclosure();
  const formatDate = useFormatDate();

  const maintenanceModeQuery = useAppSettingQuery('maintenanceMode');

  const data = maintenanceModeQuery.data ?? props;

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Maintenance Mode</h2>

              <p className="text-sm text-muted-foreground">{data.enabled ? 'Enabled' : 'Disabled'}</p>
            </div>

            <Button onClick={disclosure.onOpen}>Configure</Button>
          </div>

          {data.enabled && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {locales.map((locale) => {
                  const dir = localeDir[locale];

                  return (
                    data.message[locale] && (
                      <div key={locale}>
                        <p className="text-sm text-muted-foreground capitalize">{locale}</p>

                        <p className={cn({ 'font-cairo': dir === 'rtl' })}>{data.message[locale]}</p>
                      </div>
                    )
                  );
                })}
              </div>

              {data.countdown && (
                <div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disable on countdown end</p>

                    <p>{data.disableOnCountdownEnd ? 'Yes' : 'No'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Countdown</p>

                    <p>{formatDate(data.countdown, "MMM d, yyyy 'at' h:mma")}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <MaintenanceModeModal maintenanceMode={data} {...disclosure} />
    </>
  );
};

interface MaintenanceModeModalProps extends Disclosure {
  maintenanceMode: AppSettingsSchemas['maintenanceMode'];
}

const defaultValues: AppSettingsSchemas['maintenanceMode'] = {
  enabled: false,
  message: {
    en: '',
    ar: '',
  },
  countdown: '',
  disableOnCountdownEnd: false,
};

export const MaintenanceModeModal = ({ maintenanceMode, ...disclosure }: MaintenanceModeModalProps) => {
  const form = useForm<AppSettingsSchemas['maintenanceMode']>({
    defaultValues,
    resolver: zodResolver(appSettingsSchemas.maintenanceMode),
    mode: 'onChange',
  });
  const { isDirty } = useFormState({ control: form.control });

  const setMaintenanceModeMutation = useSetAppSettingsMutation('maintenanceMode');

  const onOpenChange = (open: boolean) => {
    if (setMaintenanceModeMutation.isPending) return;

    if (!open) {
      form.reset(defaultValues);
      setMaintenanceModeMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  useEffect(() => {
    if (!disclosure.open) return;

    form.reset(maintenanceMode);
  }, [disclosure.open, maintenanceMode, form]);

  const onSubmit: SubmitHandler<AppSettingsSchemas['maintenanceMode']> = async (data) => {
    if (setMaintenanceModeMutation.isPending) return;

    const hasMessage = Object.values(data.message ?? {}).some((msg) => msg && msg.trim() !== '');

    await setMaintenanceModeMutation.mutateAsync(
      { ...data, message: hasMessage ? data.message : undefined },
      {
        onSuccess: () => {
          toast.success('Maintenance mode configuration updated successfully.');

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
      title="Configure Maintenance Mode"
      description="Control maintenance mode and the message shown to users."
      {...disclosure}
      onOpenChange={onOpenChange}
    >
      <Form {...form} onSubmit={onSubmit} className="flex-1 flex flex-col gap-5">
        <Controller
          name="enabled"
          control={form.control}
          render={({ field }) => (
            <FieldLabel htmlFor="maintenance-enabled">
              <Field orientation="horizontal">
                <FieldTitle className="text-base font-medium">Enable maintenance mode</FieldTitle>

                <Switch checked={field.value} onCheckedChange={field.onChange} id="maintenance-enabled" />
              </Field>
            </FieldLabel>
          )}
        />

        {enabled && (
          <>
            <div>
              <LocalizedForm<AppSettingsSchemas['maintenanceMode']> name="message" />

              <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[form.formState.errors.message]} />
            </div>

            <div className="flex flex-col gap-5">
              <Controller
                name="disableOnCountdownEnd"
                control={form.control}
                render={({ field }) => (
                  <FieldLabel htmlFor="disable-on-countdown-end">
                    <Field orientation="horizontal">
                      <FieldTitle className="text-base font-medium">Disable on countdown end</FieldTitle>

                      <Switch checked={field.value} onCheckedChange={field.onChange} id="disable-on-countdown-end" />
                    </Field>
                  </FieldLabel>
                )}
              />

              <Controller
                name="countdown"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <DateTimeSelector
                      value={field.value ?? undefined}
                      onChange={(date) => {
                        if (!date) return form.setValue('countdown', null, { shouldValidate: true });

                        field.onChange(date.toISOString());
                      }}
                    />

                    <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                  </>
                )}
              />
            </div>
          </>
        )}

        <ModalFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full h-auto py-2 text-lg"
            isLoading={setMaintenanceModeMutation.isPending}
            isDisabled={!isDirty}
          >
            Save Configuration
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
