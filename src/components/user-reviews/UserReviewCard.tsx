'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { DragDropVerticalIcon, PencilEdit02Icon, Trash } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { UserReview } from '@/api';
import { useDisclosure, useRemoveUserReviewMutation } from '@/hooks';
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
import { UserReviewFormModal } from './UserReviewFormModal';
import { Button } from '../Button';
import { Image } from '../Image';
import { Link } from '../Link';

interface UserReviewCardProps extends UserReview {
  isDisabled?: boolean;
  preview?: boolean;
}

export const UserReviewCard = ({ preview = false, isDisabled = false, ...userReview }: UserReviewCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: userReview.id });

  const updateModalDisclosure = useDisclosure();

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex-1 flex flex-col-reverse md:flex-row items-center gap-4"
    >
      {!preview && (
        <div className="flex gap-2 md:flex-col">
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

            <UserReviewFormModal disclosure={updateModalDisclosure} userReview={userReview} />
          </div>

          <RemoveUserReview isDisabled={isDisabled} {...userReview} />
        </div>
      )}

      <Link
        href={userReview.facebookURL}
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

const RemoveUserReview = ({ isDisabled, position, id }: RemoveUserReviewProps) => {
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
