'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon, Trash } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import { Brand, defaultLocale, localeDir, locales } from '@/api';
import { useDisclosure, useRemoveBrandMutation } from '@/hooks';
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
import { BrandFormModal } from './BrandFormModal';
import { Image } from '../Image';
import { Button } from '../Button';

interface BrandCardProps extends Brand {
  preview?: boolean;
}

export const BrandCard = ({ preview = false, ...brand }: BrandCardProps) => {
  const modalDisclosure = useDisclosure();

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="flex-0 w-full h-full flex flex-col justify-center items-center bg-white dark:bg-border rounded-lg p-2 aspect-video">
        <Image
          image={brand.image}
          alt={brand.name[defaultLocale]}
          className="h-full w-fit overflow-hidden object-contain bg-contain!"
        />
      </div>

      <div>
        {locales.map((locale) => (
          <p
            key={locale}
            dir={localeDir[locale]}
            className={cn('text-base md:text-lg lg:text-xl font-medium text-center line-clamp-1', {
              'font-cairo': localeDir[locale] === 'rtl',
            })}
          >
            {brand.name[locale]}
          </p>
        ))}
      </div>

      {!preview && (
        <div className="absolute top-2 inset-e-2 flex gap-2">
          <div>
            <Button
              icon={<HugeiconsIcon icon={PencilEdit02Icon} className="rtl:rotate-y-180" />}
              onClick={modalDisclosure.onOpen}
            />

            <BrandFormModal disclosure={modalDisclosure} brand={brand} />
          </div>

          <RemoveBrand {...brand} />
        </div>
      )}
    </div>
  );
};

const RemoveBrand = ({ name, id }: Brand) => {
  const removeBrandMutation = useRemoveBrandMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" icon={<HugeiconsIcon icon={Trash} className="rtl:rotate-y-180" />} />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Brand</AlertDialogTitle>

          <AlertDialogDescription>Are you sure you want to remove the {name.en} brand?</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              removeBrandMutation.mutate(id, {
                onSuccess: () => toast.success(`${name.en} brand removed successfully`),
              })
            }
          >
            Remove Brand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
