'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { DragDropVerticalIcon, PencilEdit02Icon, Trash } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import { UserReview } from '@/api';
import { useDisclosure, useRemoveUserReviewMutation } from '@/hooks';
import { cn } from '@/lib/utils';
import type { ReorderableItemProps } from '@/components';

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
import { UserReviewFormModal } from './UserReviewFormModal';
import { Button } from '../Button';
import { Image } from '../Image';
import { Link } from '../Link';

interface UserReviewCardProps extends UserReview, ReorderableItemProps {
  isDisabled?: boolean;
  preview?: boolean;
}

export const UserReviewCard = ({
  preview = false,
  isDisabled = false,
  sortable,
  ...userReview
}: UserReviewCardProps) => {
  const { containerProps: container, buttonProps: itemOptions } = sortable;

  const updateModalDisclosure = useDisclosure();

  return (
    <div
      ref={container.ref}
      style={container.style}
      className="flex-1 flex flex-col-reverse md:flex-row items-center gap-4"
    >
      {!preview && (
        <div className="flex gap-2 md:flex-col">
          <Button
            {...itemOptions}
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

            <UserReviewFormModal disclosure={updateModalDisclosure} userReview={userReview} />
          </div>

          <RemoveUserReview isDisabled={isDisabled} {...userReview} />
        </div>
      )}

      <Link
        href={userReview.facebookURL}
        target="_blank"
        className="text-base md:text-lg lg:text-xl font-medium text-center flex-1 w-full h-full flex flex-col justify-center items-center bg-white dark:bg-border rounded-lg p-2"
      >
        <Image
          image={userReview.image}
          alt={`Position ${userReview.position}`}
          className="h-full w-fit overflow-hidden object-contain bg-contain!"
        />
      </Link>
    </div>
  );
};

interface RemoveUserReviewProps extends UserReview {
  isDisabled?: boolean;
}

const RemoveUserReview = ({ isDisabled, position }: RemoveUserReviewProps) => {
  const removeUserReviewMutation = useRemoveUserReviewMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button isDisabled={isDisabled} variant="destructive" icon={<HugeiconsIcon icon={Trash} />} />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove UserReview</AlertDialogTitle>

          <AlertDialogDescription>Are you sure you want to remove the {position} userReview?</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              removeUserReviewMutation.mutate(position, {
                onSuccess: () => toast.success(`${position} userReview removed successfully`),
              })
            }
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
