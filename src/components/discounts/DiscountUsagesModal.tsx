import { useDisclosure, useDiscountUsagesQuery, useFormatCurrency, useFormatLabeledDate } from '@/hooks';

import { Modal } from '../Modal';
import { Button } from '../Button';
import { Spinner } from '../ui';
import { HugeiconsIcon } from '@hugeicons/react';
import { View } from '@hugeicons/core-free-icons';
import { Link } from '../Link';

interface DiscountUsagesModalProps {
  discountId: number;
}

export const DiscountUsagesModal = ({ discountId }: DiscountUsagesModalProps) => {
  const disclosure = useDisclosure();

  const formatLabeledDate = useFormatLabeledDate();
  const formatCurrency = useFormatCurrency();

  const discountUsagesQuery = useDiscountUsagesQuery(discountId);

  return (
    <>
      <Button
        isDisabled={discountUsagesQuery.data?.length === 0}
        isLoading={discountUsagesQuery.isPending}
        loadingIconClassName="size-4"
        tooltip={{
          tooltip:
            discountUsagesQuery.isSuccess && discountUsagesQuery.data.length === 0
              ? 'No usages found for this discount.'
              : undefined,
        }}
        onClick={disclosure.onOpen}
        icon={<HugeiconsIcon icon={View} />}
      />

      <Modal title={`Discount Usages (${discountUsagesQuery.data?.length ?? 0})`} {...disclosure}>
        <div className="flex flex-col gap-4 overflow-y-auto">
          {discountUsagesQuery.isPending ? (
            <Spinner className="size-8 m-auto" />
          ) : (
            discountUsagesQuery.data?.map((discountUsage) => (
              <Link
                href={`/orders/${discountUsage.order.orderNumber}`}
                key={discountUsage.id}
                className="flex gap-4 border rounded-lg shadow-sm p-4 justify-between items-center hover:opacity-80 transition-opacity duration-300"
              >
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                  <h3 className="font-medium text-sm truncate min-w-0">{discountUsage.user.name}</h3>

                  <p className="text-muted-foreground text-sm truncate">{discountUsage.user.email}</p>

                  <p className="text-muted-foreground text-xs">{formatLabeledDate(discountUsage.createdAt)}</p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <p className="w-fit rounded-full bg-sidebar md:bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {discountUsage.order.orderNumber}
                  </p>

                  <p className="w-fit rounded-full bg-sidebar md:bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {formatCurrency(discountUsage.order.total)}
                  </p>

                  {discountUsage.discountAmount !== null && (
                    <p className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      -{formatCurrency(discountUsage.discountAmount)}
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}

          {discountUsagesQuery.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">No usages found for this discount.</p>
          )}
        </div>
      </Modal>
    </>
  );
};
