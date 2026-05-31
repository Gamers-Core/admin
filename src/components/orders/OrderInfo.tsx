'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { DeliveryTracking01Icon, StoreVerified01Icon } from '@hugeicons/core-free-icons';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { toast } from 'sonner';

import {
  Disclosure,
  useDisclosure,
  useFormatDate,
  useOrderQuery,
  useRestockInventoryMutation,
  useUpdateShippingMutation,
} from '@/hooks';
import { OrderShippingSchema, orderShippingSchema } from '@/api';

import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderItemsPanel } from './OrderItemsPanel';
import { Link } from '../Link';
import { Modal, ModalFooter } from '../Modal';
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
  Input,
} from '../ui';
import { Button } from '../Button';
import { Form } from '../Form';

interface OrderInfoProps {
  orderNumber: string;
}

export const OrderInfo = ({ orderNumber }: OrderInfoProps) => {
  const orderQuery = useOrderQuery(orderNumber);
  const restockInventoryMutation = useRestockInventoryMutation();

  const formatDate = useFormatDate();
  const trackingNumberDisclosure = useDisclosure();

  if (!orderQuery.data) return null;

  const trackingNumber = orderQuery.data.trackingNumber;
  const encodedTrackingNumber = trackingNumber ? encodeURIComponent(trackingNumber) : '';

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 backdrop-blur-sm shadow-sm">
      <div className="border-b border-border p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Order #{orderQuery.data.orderNumber}</p>

            <h2 className="text-xl font-semibold tracking-tight">Order Details</h2>
          </div>

          <div className="flex gap-2 items-center justify-end">
            {orderQuery.data.restocked && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap w-fit max-w-full bg-green-500/10 text-green-600">
                Inventory Restocked
              </span>
            )}

            <OrderStatusBadge status={orderQuery.data.status} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={StoreVerified01Icon} className="size-4 shrink-0" />

            <span>{formatDate(orderQuery.data.createdAt, "MMM d, yyyy 'at' h:mma")}</span>
          </div>

          <div className="flex gap-3 rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar">
              <HugeiconsIcon icon={DeliveryTracking01Icon} className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Tracking Number</p>

                  {orderQuery.data.trackingNumber ? (
                    <p className="truncate font-semibold text-foreground">{orderQuery.data.trackingNumber}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tracking number yet</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {trackingNumber && (
                    <>
                      <Link
                        href={`https://bosta.co/en-eg/tracking-shipments?shipment-number=${encodedTrackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-sidebar px-3 py-1 text-sm font-medium text-sidebar-primary transition-colors hover:bg-sidebar-accent hover:underline"
                      >
                        Track
                      </Link>

                      <Link
                        href={`https://business.bosta.co/orders/${encodedTrackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
                      >
                        Dashboard
                      </Link>
                    </>
                  )}

                  <Button
                    variant="outline"
                    onClick={trackingNumberDisclosure.onOpen}
                    className="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar hover:text-foreground"
                  >
                    Edit
                  </Button>
                </div>

                <TrackingNumberModal
                  trackingNumber={orderQuery.data.trackingNumber}
                  orderNumber={orderQuery.data.orderNumber}
                  {...trackingNumberDisclosure}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <OrderItemsPanel order={orderQuery.data} />

        {orderQuery.data.status === 'returned' && !orderQuery.data.restocked && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full ms-auto w-fit border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-600 transition-colors hover:bg-yellow-500/20 dark:text-yellow-400"
              >
                Restock Inventory
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent size="default">
              <AlertDialogHeader>
                <AlertDialogTitle>Restock Inventory</AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to restock the inventory for this order?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={restockInventoryMutation.isPending}>Cancel</AlertDialogCancel>

                <AlertDialogAction asChild>
                  <Button
                    isLoading={restockInventoryMutation.isPending}
                    onClick={async () =>
                      await restockInventoryMutation.mutateAsync(orderNumber, {
                        onSuccess: () => toast.success('Inventory restocked successfully'),
                      })
                    }
                  >
                    Restock
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </section>
  );
};

interface TrackingNumberModalProps extends Disclosure {
  orderNumber: string;
  trackingNumber: string | null;
}

const TrackingNumberModal = ({ trackingNumber, orderNumber, ...disclosure }: TrackingNumberModalProps) => {
  const form = useForm({
    defaultValues: { trackingNumber: trackingNumber || '' },
    mode: 'onChange',
    resolver: zodResolver(orderShippingSchema),
  });

  const updateShippingMutation = useUpdateShippingMutation();

  useEffect(() => {
    if (disclosure.open) form.reset({ trackingNumber: trackingNumber || '' });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disclosure.open]);

  const onSubmit: SubmitHandler<OrderShippingSchema> = (data) => {
    if (updateShippingMutation.isPending) return;

    updateShippingMutation.mutate(
      { orderNumber, ...data },
      {
        onSuccess: () => {
          toast.success('Tracking number updated successfully');

          form.reset(data);

          disclosure.onClose();
        },
      },
    );
  };

  return (
    <Modal {...disclosure} title="Tracking Number" description="Add or edit the tracking number for this order.">
      <Form {...form} onSubmit={onSubmit} className="flex-1 flex flex-col gap-4">
        <Controller
          name="trackingNumber"
          control={form.control}
          defaultValue={trackingNumber || ''}
          render={({ field }) => <Input {...field} />}
        />

        <ModalFooter>
          <Button
            isDisabled={!form.formState.isValid || !form.formState.isDirty}
            isLoading={updateShippingMutation.isPending}
            onClick={form.handleSubmit(onSubmit)}
            className="w-full h-auto py-2 text-lg"
          >
            Save
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
