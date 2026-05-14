import { DeliveryBox01FreeIcons, FileText, House, Store01Icon } from '@hugeicons/core-free-icons';

import { Route } from './types';

export const routes: Route[] = [
  {
    title: 'Home',
    url: '/',
    icon: House,
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: DeliveryBox01FreeIcons,
  },
  {
    title: 'Store',
    icon: Store01Icon,
    items: [
      {
        title: 'Products',
        url: '/products',
      },
      {
        title: 'Inventory',
        url: '/inventory',
      },
      {
        title: 'Brands',
        url: '/brands',
      },
      {
        title: 'Categories',
        url: '/categories',
      },
      {
        title: 'Featured Variants',
        url: '/featured-variants',
      },
    ],
  },
  {
    title: 'Content',
    icon: FileText,
    items: [
      {
        title: 'Faqs',
        url: '/faqs',
      },
      {
        title: 'Policies',
        url: '/policies',
      },
      {
        title: 'User Reviews',
        url: '/user-reviews',
      },
    ],
  },
];
