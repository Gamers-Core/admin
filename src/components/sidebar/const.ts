import { DeliveryBox01FreeIcons, FileText, House, Settings, Store01Icon, UserIcon } from '@hugeicons/core-free-icons';

import { Route } from './types';

export const routes = [
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
    title: 'Users',
    url: '/users',
    icon: UserIcon,
  },
  {
    title: 'Store',
    icon: Store01Icon,
    items: [
      {
        title: 'Products',
        url: '/products',
        items: [{ title: 'Add Product', url: '/products/add' }],
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
  {
    title: 'Settings',
    icon: Settings,
    url: '/settings',
  },
] as const satisfies Route[];
