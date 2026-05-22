import { OrderStatus, PaymentStatus } from '@/api';
import { cn } from '@/lib/utils';

export const statusesStyleMap = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
} as const;

const statusStyles: Record<OrderStatus | PaymentStatus, keyof typeof statusesStyleMap> = {
  pending: 'default',
  confirmed: 'success',
  'on-hold': 'warning',
  'on-progress': 'info',
  shipped: 'info',
  delivered: 'info',
  completed: 'success',
  returned: 'warning',
  cancelled: 'error',
  unpaid: 'default',
  paid: 'success',
  refunded: 'warning',
};

interface OrderStatusBadgeProps {
  status: OrderStatus | PaymentStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const displayText = status.replace('-', ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap max-w-full',
        statusesStyleMap[statusStyles[status]],
      )}
      title={displayText}
    >
      <span className="truncate">{displayText}</span>
    </span>
  );
};
