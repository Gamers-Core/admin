'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { DragDropVerticalIcon, PencilEdit02Icon, Trash } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import { defaultLocale, FeaturedVariant, localeDir, locales } from '@/api';
import { useDisclosure, useRemoveFeaturedVariantMutation } from '@/hooks';
import { cn } from '@/lib/utils';
import { ProductPreviewCard, type ReorderableItemProps } from '@/components';

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
import { FeaturedVariantFormModal } from './FeaturedVariantFormModal';
import { Button } from '../Button';

interface FeaturedVariantCardProps extends FeaturedVariant, ReorderableItemProps {
  isDisabled?: boolean;
  isMain?: boolean;
}

export const FeaturedVariantCard = ({
  sortable: { buttonProps, containerProps },
  isDisabled = false,
  isMain = false,
  ...featuredVariant
}: FeaturedVariantCardProps) => {
  const updateModalDisclosure = useDisclosure();

  return (
    <div {...containerProps} className="flex-1 flex items-center gap-4 bg-background">
      <div className="flex flex-col gap-2">
        <Button
          {...buttonProps}
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

          <FeaturedVariantFormModal disclosure={updateModalDisclosure} featuredVariant={featuredVariant} />
        </div>

        <RemoveFeaturedVariant isDisabled={isDisabled} {...featuredVariant} />
      </div>

      <div className="flex-1 relative">
        <div className="flex flex-col gap-2 border rounded-lg shadow-sm w-full">
          <div className="p-4 pb-0 flex flex-col gap-2">
            {locales.map(
              (locale) =>
                featuredVariant.title[locale] && (
                  <p
                    key={locale}
                    dir={localeDir[locale]}
                    className={cn('text-base md:text-lg lg:text-xl text-start w-full line-clamp-1', {
                      'font-cairo': localeDir[locale] === 'rtl',
                    })}
                  >
                    {featuredVariant.title[locale]}
                  </p>
                ),
            )}
          </div>

          <ProductPreviewCard variant={featuredVariant.variant} />
        </div>

        {isMain && (
          <span className="absolute -top-2 -inset-e-2 bg-primary text-primary-foreground rounded p-1 text-sm">
            Main
          </span>
        )}
      </div>
    </div>
  );
};

interface RemoveFeaturedVariantProps extends FeaturedVariant {
  isDisabled?: boolean;
}

const RemoveFeaturedVariant = ({ isDisabled, title, id }: RemoveFeaturedVariantProps) => {
  const removeFeaturedVariantMutation = useRemoveFeaturedVariantMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button isDisabled={isDisabled} variant="destructive" icon={<HugeiconsIcon icon={Trash} />} />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove featured variant</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove the {title[defaultLocale]} featured variant?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex! flex-col! gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              removeFeaturedVariantMutation.mutate(id, {
                onSuccess: () => toast.success(`${title[defaultLocale]} featured variant removed successfully`),
              })
            }
          >
            Remove featured variant
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
