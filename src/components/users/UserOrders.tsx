'use client';

import { useDisclosure, useFormatCurrency, useFormatLabeledDate, useUserQuery } from '@/hooks';

import { OrderStatusBadge } from '../orders/OrderStatusBadge';
import { Link } from '../Link';
import { Button } from '../Button';
import { OrderCreateModal } from '../orders';
import { HugeiconsIcon } from '@hugeicons/react';
import { Plus } from '@hugeicons/core-free-icons';

interface UserOrdersProps {
  userId: number;
}

export const UserOrders = ({ userId }: UserOrdersProps) => {
  const userQuery = useUserQuery(userId);

  const formatCurrency = useFormatCurrency();
  const formatLabeledDate = useFormatLabeledDate();

  const orderCreateModalDisclosure = useDisclosure();

  if (!userQuery.data) return null;

  const orders = userQuery.data.orders ?? [];

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-sidebar/80 shadow-sm backdrop-blur-sm flex-1 flex flex-col">
      <div className="flex justify-between gap-4 border-b border-border p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">User Orders</p>

          <h2 className="text-xl font-semibold tracking-tight">Orders</h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-foreground">
            {orders.length}

            <span className="ml-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Total</span>
          </span>

          <Button
            isDisabled={!userQuery.data.addresses.length}
            icon={<HugeiconsIcon icon={Plus} />}
            onClick={orderCreateModalDisclosure.onOpen}
            tooltip={{
              tooltip: !userQuery.data.addresses.length ? 'Please add an address before creating an order.' : undefined,
            }}
          />

          <OrderCreateModal
            user={{ ...userQuery.data, ordersCount: orders.length }}
            disclosure={orderCreateModalDisclosure}
          />
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1 flex flex-col gap-4">
        {orders.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((order) => {
              const total = formatCurrency(order.total, order.currency);

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.orderNumber}`}
                  className="overflow-hidden rounded-3xl border border-border bg-background/70 transition-colors hover:border-primary/40"
                >
                  <div className="border-b border-border p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Order</p>

                      <p className="text-base font-semibold truncate">#{order.orderNumber}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <OrderStatusBadge status={order.paymentStatus} />

                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Placed</span>

                      <span className="font-medium text-foreground">{formatLabeledDate(order.createdAt)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Items</span>

                      <span className="font-medium text-foreground tabular-nums">{order.items.length}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Payment</span>

                      <span className="font-medium text-foreground uppercase tracking-wide">{order.paymentMethod}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Total</span>

                      <span className="font-semibold text-foreground tabular-nums">{total}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="m-auto text-center text-sm text-muted-foreground">No orders found.</p>
        )}
      </div>
    </section>
  );
};
