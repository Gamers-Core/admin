import { getOrderStatusStyle, OrderStatus, PaymentStatus } from '@/api';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus | PaymentStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const displayText = status.replace('-', ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap max-w-full',
        getOrderStatusStyle(status),
      )}
      title={displayText}
    >
      <span className="truncate">{displayText}</span>
    </span>
  );
};
