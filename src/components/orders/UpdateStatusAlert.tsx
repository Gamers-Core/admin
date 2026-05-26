import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight } from '@hugeicons/core-free-icons';

import { OrderStatus, PaymentStatus } from '@/api';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Button } from '../Button';

interface UpdateStatusAlertProps<S extends OrderStatus | PaymentStatus> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  current: S;
  next: S;
  isPending?: boolean;
}

export const UpdateStatusAlert = <S extends OrderStatus | PaymentStatus>({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  current,
  next,
  isPending = false,
}: UpdateStatusAlertProps<S>) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent size="default">
      <AlertDialogHeader>
        <AlertDialogTitle>Update Status</AlertDialogTitle>

        <AlertDialogDescription asChild>
          <div className="flex flex-col gap-4 w-full">
            <p> Are you sure you want to update status?</p>

            <div className="flex items-center gap-1 justify-center">
              <OrderStatusBadge status={current} />

              <HugeiconsIcon icon={ArrowRight} />

              <OrderStatusBadge status={next} />
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel} disabled={isPending}>
          Cancel
        </AlertDialogCancel>

        <AlertDialogAction asChild onClick={onSubmit} disabled={isPending}>
          <Button isLoading={isPending}>Update</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
