'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { BackendError, FAQ, faqSchema, FAQSchema, ValidationErrors, defaultLocalizedValue } from '@/api';
import { Disclosure, useAddFAQMutation, useUpdateFAQMutation } from '@/hooks';

import { Form } from '../Form';
import { LocalizedForm } from '../LocalizedForm';
import { Button } from '../Button';
import { Modal, ModalFooter } from '../Modal';

interface FAQFormModalProps {
  faq?: FAQ;
  disclosure: Disclosure;
}

const defaultValues: FAQSchema = {
  question: defaultLocalizedValue,
  answer: defaultLocalizedValue,
};

export const FAQFormModal = ({ faq, disclosure }: FAQFormModalProps) => {
  const form = useForm<FAQSchema>({
    defaultValues: faq ?? defaultValues,
    mode: 'onChange',
    resolver: zodResolver(faqSchema),
  });

  const updateFAQMutation = useUpdateFAQMutation();
  const addFAQMutation = useAddFAQMutation();

  const isLoading = updateFAQMutation.isPending || addFAQMutation.isPending;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      updateFAQMutation.reset();
      addFAQMutation.reset();
    }

    disclosure.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<FAQSchema> = async (data) => {
    if (!form.formState.isValid || isLoading) return;

    const onSuccess = () => {
      toast.success(`FAQ ${faq ? 'updated' : 'added'} successfully.`);

      onOpenChange(false);
    };

    const onError = (validationErrors: BackendError<ValidationErrors<keyof FAQSchema>> | null) => {
      if (!validationErrors) return;

      validationErrors.errors.forEach((error) => {
        form.setError(error.property, { message: error.messages[0] });
      });
    };

    if (faq) return updateFAQMutation.mutate({ ...data, id: faq.id }, { onSuccess, onError });

    addFAQMutation.mutate(data, { onSuccess, onError });
  };

  return (
    <Modal
      title={faq ? `Update FAQ ${faq.position}` : 'Add New FAQ'}
      description={
        faq ? `Update the faq ${faq.position} information.` : 'Add a new faq to the list of frequently asked questions.'
      }
      asChild
      {...disclosure}
      onOpenChange={onOpenChange}
    >
      <Form className="flex-1 min-h-0 flex flex-col gap-5" onSubmit={onSubmit} {...form}>
        <LocalizedForm<FAQSchema> name="question" />
        <LocalizedForm<FAQSchema> name="answer" type="richtext" />

        <ModalFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full h-auto py-2 text-lg"
            isDisabled={!form.formState.isValid || addFAQMutation.isSuccess || updateFAQMutation.isSuccess}
            isLoading={isLoading}
          >
            {faq ? 'Update' : 'Add'} FAQ
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
