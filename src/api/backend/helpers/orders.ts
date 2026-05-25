import { IconSvgElement } from '@hugeicons/react';
import {
  CheckmarkCircleIcon,
  ExclamationMarkBigIcon,
  ProgressIcon,
  ShippingTruck01Icon,
  DeliveryView01Icon,
  Alert02Icon,
  MultiplicationSignCircleIcon,
  ClockIcon,
} from '@hugeicons/core-free-icons';

import { Order, OrderStatus, PaymentStatus } from '../types';

export interface OrderStatusItem {
  status: OrderStatus | PaymentStatus;
  date: Date;
  style: 'default' | 'success' | 'error' | 'warning' | 'info';
  icon: IconSvgElement;
}

interface StatusMapItem {
  style: OrderStatusItem['style'];
  icon: IconSvgElement;
}

export const statusesStyleMap = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
} as const;

export const statusStyles: Record<OrderStatus | PaymentStatus, StatusMapItem> = {
  pending: { style: 'default', icon: ClockIcon },
  confirmed: { style: 'success', icon: CheckmarkCircleIcon },
  'on-hold': { style: 'warning', icon: ExclamationMarkBigIcon },
  'on-progress': { style: 'info', icon: ProgressIcon },
  shipped: { style: 'info', icon: ShippingTruck01Icon },
  delivered: { style: 'info', icon: DeliveryView01Icon },
  completed: { style: 'success', icon: CheckmarkCircleIcon },
  returned: { style: 'warning', icon: Alert02Icon },
  cancelled: { style: 'error', icon: MultiplicationSignCircleIcon },
  unpaid: { style: 'default', icon: ClockIcon },
  paid: { style: 'success', icon: CheckmarkCircleIcon },
  refunded: { style: 'warning', icon: Alert02Icon },
};

export const getOrderStatuses = (order: Order): OrderStatusItem[] =>
  order.history
    .map(({ status, createdAt }) => ({ status, date: new Date(createdAt), ...statusStyles[status] }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

export const getOrderStatusStyle = (status: OrderStatus | PaymentStatus) =>
  statusesStyleMap[statusStyles[status].style];
