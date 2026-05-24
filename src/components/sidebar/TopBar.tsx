'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarTrigger,
} from '../ui';
import { getActiveItem, getBreadcrumbs } from './helpers';
import { Link } from '../Link';

interface TopBarProps {
  pathname: string | null;
  onPortalReady?: (el: HTMLElement | null) => void;
}

export const TopBar = (props: TopBarProps) => {
  const { pathname: fallbackPathname, onPortalReady } = props;
  const pathname = usePathname();
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(null);

  const activeItem = getActiveItem(pathname || fallbackPathname || '/');

  const breadcrumbs = getBreadcrumbs(pathname || fallbackPathname || '/');

  useEffect(() => {
    onPortalReady?.(portalElement);
  }, [portalElement, onPortalReady]);

  if (!activeItem) return null;

  return (
    <header className="right-(--removed-body-scroll-bar-size,0) z-50 transition-all duration-300 border-b-2 border-sidebar">
      <div className="flex items-center justify-between gap-2 md:gap-4 px-4 py-3 bg-transparent transition-colors duration-300 text-sm font-medium text-muted-foreground">
        <div className="flex items-center">
          <SidebarTrigger size="icon-lg" />

          <Separator orientation="vertical" className="mx-2 h-auto" />

          <Breadcrumb className="line-clamp-1">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className="text-sm md:text-base font-medium capitalize">
                      {'url' in crumb && crumb.url && !isLast ? (
                        <Link href={crumb.url} prefetch>
                          {crumb.title}
                        </Link>
                      ) : isLast ? (
                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                      ) : (
                        <span>{crumb.title}</span>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div ref={setPortalElement} className="flex items-center justify-end flex-1" />
      </div>
    </header>
  );
};
