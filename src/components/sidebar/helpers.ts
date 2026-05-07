import { sidebarItems } from './const';
import { NavigationItem, SubSidebarItem } from './types';

export const getActiveItem = (pathname: string) => {
  return sidebarItems.reduce<NavigationItem | SubSidebarItem | null>((activeItem, item) => {
    if ('url' in item && item.url === pathname) return item;

    if ('items' in item) {
      const subItem = item.items.find((sub) => sub.url === pathname);

      if (subItem) return subItem;
    }

    return activeItem;
  }, null);
};
