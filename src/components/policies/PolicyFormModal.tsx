'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Policy, policySchema, PolicySchema, defaultLocalizedValue, PolicyType } from '@/api';
import { Disclosure, usePoliciesMutation } from '@/hooks';

import { Form } from '../Form';
import { LocalizedForm } from '../LocalizedForm';
import { Button } from '../Button';
import { Modal, ModalFooter } from '../Modal';

interface PolicyFormModalProps {
  policyType: PolicyType;
  policy?: Policy;
  disclosure: Disclosure;
}

const defaultValues: PolicySchema = {
  value: defaultLocalizedValue,
};

export const PolicyFormModal = ({ policy, policyType, disclosure }: PolicyFormModalProps) => {
  const form = useForm<PolicySchema>({
    defaultValues: policy ?? defaultValues,
    mode: 'onChange',
    resolver: zodResolver(policySchema),
  });

  const policyMutation = usePoliciesMutation();

  useEffect(() => {
    if (!disclosure.open) return;
    form.reset(policy ?? defaultValues);
  }, [policy, disclosure.open, form]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      policyMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<PolicySchema> = async (data) => {
    if (!form.formState.isValid || policyMutation.isPending) return;

    policyMutation.mutate(
      { ...data, type: policy?.type || policyType },
      {
        onSuccess: () => {
          toast.success(`Policy ${policy ? 'updated' : 'added'} successfully.`);

          onOpenChange(false);
        },
        onError: (validationErrors) => {
          if (!validationErrors) return;

          validationErrors.errors.forEach((error) => {
            form.setError(error.property, { message: error.messages[0] });
          });
        },
      },
    );
  };

  return (
    <Modal
      title={policy ? `Update Policy ${policy.type}` : 'Add New Policy'}
      description={
        policy
          ? `Update the policy ${policy.type} information.`
          : 'Add a new policy to the list of frequently asked questions.'
      }
      asChild
      {...disclosure}
      onOpenChange={onOpenChange}
      fullscreen
    >
      <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onSubmit} {...form}>
        <div className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto">
          <LocalizedForm<PolicySchema> name="value" type="richtext" />
        </div>

        <ModalFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full h-auto py-2 text-lg"
            isDisabled={!form.formState.isValid || policyMutation.isSuccess}
            isLoading={policyMutation.isPending}
          >
            {policy ? 'Update' : 'Add'} Policy
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
