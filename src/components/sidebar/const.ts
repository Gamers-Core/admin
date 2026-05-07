import { DeliveryBox01FreeIcons, FileText, House, Store01Icon } from '@hugeicons/core-free-icons';
import { SidebarItem } from './types';

export const sidebarItems: SidebarItem[] = [
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
    title: 'Products',
    icon: Store01Icon,
    items: [
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
    title: 'Static Content',
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
