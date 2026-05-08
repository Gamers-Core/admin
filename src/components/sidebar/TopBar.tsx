'use client';

import { usePathname } from 'next/navigation';

import { Separator, SidebarTrigger } from '../ui';
import { getActiveItem } from './helpers';

interface TopBarProps {
  pathname: string | null;
}

export const TopBar = (props: TopBarProps) => {
  const pathname = usePathname();

  const activeItem = getActiveItem(pathname || props.pathname || '/');

  if (!activeItem) return null;

  return (
    <header className="right-(--removed-body-scroll-bar-size,0) z-50 transition-all duration-300 border-b-2 border-sidebar">
      <div className="flex items-center justify-between px-4 py-3 bg-transparent transition-colors duration-300 text-sm font-medium text-muted-foreground">
        <div className="flex items-center">
          <SidebarTrigger size="icon-lg" />

          <Separator orientation="vertical" className="mx-2 h-auto" />

          <h1 className="text-base font-medium">{activeItem?.title}</h1>
        </div>

        {'cta' in activeItem && activeItem.cta && <div className="flex items-center gap-2">{activeItem.cta}</div>}
      </div>
    </header>
  );
};
