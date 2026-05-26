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
  useFormatCurrency,
  useFormatDate,
  useOrderQuery,
  useUpdateShippingMutation,
} from '@/hooks';
import { defaultLocale, OrderShippingSchema, orderShippingSchema } from '@/api';

import { OrderStatusBadge } from './OrderStatusBadge';
import { Link } from '../Link';
import { Image } from '../Image';
import { Modal, ModalFooter } from '../Modal';
import { Input } from '../ui';
import { Button } from '../Button';
import { Form } from '../Form';

interface OrderInfoProps {
  orderNumber: string;
}

export const OrderInfo = ({ orderNumber }: OrderInfoProps) => {
  const orderQuery = useOrderQuery(orderNumber);

  const formatDate = useFormatDate();
  const formatCurrency = useFormatCurrency();
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

          <OrderStatusBadge status={orderQuery.data.status} />
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

      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-4">
          {orderQuery.data.items.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-border bg-background/70 p-4 transition-all duration-300 hover:border-sidebar-primary/30 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4 min-w-0">
                  <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-sidebar p-1">
                    <Image
                      src={item.imageURL}
                      width={80}
                      height={80}
                      alt={item.productTitle[defaultLocale] + ' - ' + item.variantName?.[defaultLocale]}
                      className="h-20 w-20 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1 py-1 flex flex-col gap-1">
                    <Link
                      href={`/products/${item.productId}`}
                      target="_blank"
                      className="line-clamp-2 text-base font-semibold text-foreground hover:underline"
                      title={item.productTitle[defaultLocale]}
                    >
                      {item.productTitle[defaultLocale]}
                    </Link>

                    {item.variantName && (
                      <p className="text-sm text-muted-foreground">{item.variantName[defaultLocale]}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground font-medium">{formatCurrency(item.unitPrice)}</span>

                    <span className="text-muted-foreground">x</span>

                    <span className="min-w-7 rounded-full bg-sidebar px-2 py-1 text-center text-xs font-semibold text-foreground">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-sidebar-primary">{formatCurrency(item.lineTotal)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-4">
        <Controller
          name="trackingNumber"
          control={form.control}
          defaultValue={trackingNumber || ''}
          render={({ field }) => <Input {...field} />}
        />

        <ModalFooter>
          <Button variant="outline" onClick={disclosure.onClose}>
            Cancel
          </Button>

          <Button
            isDisabled={!form.formState.isValid || !form.formState.isDirty}
            isLoading={updateShippingMutation.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
