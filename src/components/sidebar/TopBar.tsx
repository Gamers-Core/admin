'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

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
import { useTopBarStore } from '@/stores';

interface TopBarProps {
  pathname: string | null;
}

export const TopBar = (props: TopBarProps) => {
  const pathname = usePathname();

  const cta = useTopBarStore((state) => state.cta);

  const activeItem = getActiveItem(pathname || props.pathname || '/');

  if (!activeItem) return null;

  const breadcrumbs = getBreadcrumbs(pathname || props.pathname || '/');

  return (
    <header className="right-(--removed-body-scroll-bar-size,0) z-50 transition-all duration-300 border-b-2 border-sidebar">
      <div className="flex items-center justify-between px-4 py-3 bg-transparent transition-colors duration-300 text-sm font-medium text-muted-foreground">
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

        {cta && <div className="flex items-center gap-2">{cta}</div>}
      </div>
    </header>
  );
};
