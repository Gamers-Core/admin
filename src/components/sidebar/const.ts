import { DeliveryBox01FreeIcons, FileText, House, Store01Icon } from '@hugeicons/core-free-icons';

import { SidebarItem } from './types';
import { BrandsCTA } from '../brands';
import { CategoriesCTA } from '../categories';
import { FAQsCTA } from '../faqs';
import { UserReviewsCTA } from '../user-reviews';

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
        cta: BrandsCTA,
      },
      {
        title: 'Categories',
        url: '/categories',
        cta: CategoriesCTA,
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
        cta: FAQsCTA,
      },
      {
        title: 'Policies',
        url: '/policies',
      },
      {
        title: 'User Reviews',
        url: '/user-reviews',
        cta: UserReviewsCTA,
      },
    ],
  },
];
