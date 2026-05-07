import { IconSvgElement } from '@hugeicons/react';
import { ReactNode } from 'react';

export interface SubSidebarItem {
  title: string;
  url: string;
  cta?: ReactNode;
}

export interface NavigationItem {
  title: string;
  icon: IconSvgElement;
  url: string;
  cta?: ReactNode;
}

export interface NavigationItemWithSubItems {
  title: string;
  icon: IconSvgElement;
  items: SubSidebarItem[];
}

export type SidebarItem = NavigationItem | NavigationItemWithSubItems;
