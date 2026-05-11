'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon, Trash } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import { Category, localeDir, locales } from '@/api';
import { useDisclosure, useRemoveCategoryMutation } from '@/hooks';
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
import { CategoryFormModal } from './CategoryFormModal';
import { Button } from '../Button';

interface CategoryCardProps extends Category {
  preview?: boolean;
}

export const CategoryCard = ({ preview = false, ...category }: CategoryCardProps) => {
  const modalDisclosure = useDisclosure();

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="flex flex-col gap-4 w-full p-6 bg-border rounded-lg h-full">
        {locales.map((locale) => (
          <p
            key={locale}
            dir={localeDir[locale]}
            className={cn('text-base md:text-lg lg:text-xl font-bold text-center line-clamp-1', {
              'font-cairo': localeDir[locale] === 'rtl',
            })}
          >
            {category.name[locale]}
          </p>
        ))}
      </div>

      {!preview && (
        <div className="flex gap-2">
          <div>
            <Button
              icon={<HugeiconsIcon icon={PencilEdit02Icon} className="rtl:rotate-y-180" />}
              onClick={modalDisclosure.onOpen}
            />

            <CategoryFormModal disclosure={modalDisclosure} category={category} />
          </div>

          <RemoveCategory {...category} />
        </div>
      )}
    </div>
  );
};

const RemoveCategory = ({ name, id }: Category) => {
  const removeCategoryMutation = useRemoveCategoryMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" icon={<HugeiconsIcon icon={Trash} className="rtl:rotate-y-180" />} />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Category</AlertDialogTitle>

          <AlertDialogDescription>Are you sure you want to remove the {name.en} category?</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              removeCategoryMutation.mutate(id, {
                onSuccess: () => toast.success(`${name.en} category removed successfully`),
              })
            }
          >
            Remove Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
