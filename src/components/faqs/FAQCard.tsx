'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { DragDropVerticalIcon, PencilEdit02Icon, Trash } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FAQ, localeDir, locales } from '@/api';
import { Disclosure, useDisclosure, useRemoveFAQMutation } from '@/hooks';
import { cn } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui';
import { FAQFormModal } from './FAQFormModal';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { HTMLRender } from '../HTMLRender';

interface FAQCardProps extends FAQ {
  isDisabled?: boolean;
  preview?: boolean;
  index: number;
}

export const FAQCard = ({ preview = false, isDisabled = false, index, ...faq }: FAQCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index });

  const updateModalDisclosure = useDisclosure();
  const previewModalDisclosure = useDisclosure();

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex-1 flex items-center gap-4"
    >
      {!preview && (
        <div className="flex flex-col gap-2">
          <Button
            {...attributes}
            {...listeners}
            className={cn('cursor-grab aria-pressed:cursor-grabbing touch-none')}
            isDisabled={isDisabled}
            variant="outline"
            icon={<HugeiconsIcon icon={DragDropVerticalIcon} />}
          />

          <div>
            <Button
              isDisabled={isDisabled}
              icon={<HugeiconsIcon icon={PencilEdit02Icon} />}
              onClick={updateModalDisclosure.onOpen}
            />

            <FAQFormModal disclosure={updateModalDisclosure} faq={faq} />
          </div>

          <RemoveFAQ isDisabled={isDisabled} {...faq} />
        </div>
      )}

      <Button
        onClick={previewModalDisclosure.onOpen}
        variant="ghost"
        className="flex-1 min-w-0 flex flex-col gap-4 p-6 bg-border rounded-lg h-full"
      >
        {locales.map((locale) => (
          <p
            key={locale}
            dir={localeDir[locale]}
            className={cn('text-base md:text-lg lg:text-xl font-bold text-start w-full line-clamp-1', {
              'font-cairo': localeDir[locale] === 'rtl',
            })}
          >
            {faq.question[locale]}
          </p>
        ))}
      </Button>

      <FAQModal {...previewModalDisclosure} faq={faq} />
    </div>
  );
};

interface RemoveFAQProps extends FAQ {
  isDisabled?: boolean;
}

const RemoveFAQ = ({ isDisabled, question, id }: RemoveFAQProps) => {
  const removeFAQMutation = useRemoveFAQMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button isDisabled={isDisabled} variant="destructive" icon={<HugeiconsIcon icon={Trash} />} />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove FAQ</AlertDialogTitle>

          <AlertDialogDescription>Are you sure you want to remove the {question.en} faq?</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              removeFAQMutation.mutate(id, {
                onSuccess: () => toast.success(`${question.en} faq removed successfully`),
              })
            }
          >
            Remove FAQ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface FAQModalProps extends Disclosure {
  faq: FAQ;
}

const FAQModal = ({ faq, ...disclosure }: FAQModalProps) => (
  <Modal {...disclosure} title="Preview FAQ">
    {locales.map(
      (locale) =>
        faq.question[locale] &&
        faq.answer[locale] && (
          <div key={locale} className="bg-muted rounded-lg p-4 flex flex-col gap-2">
            <p
              dir={localeDir[locale]}
              className={cn('text-base md:text-lg lg:text-xl text-start w-full', {
                'font-cairo': localeDir[locale] === 'rtl',
              })}
            >
              {faq.question[locale]}
            </p>

            <div
              dir={localeDir[locale]}
              className={cn('text-sm text-muted-foreground text-start w-full', {
                'font-cairo': localeDir[locale] === 'rtl',
              })}
            >
              <AnswerHTML html={faq.answer[locale]} />
            </div>
          </div>
        ),
    )}
  </Modal>
);

const AnswerHTML = HTMLRender('AnswerHTML');
