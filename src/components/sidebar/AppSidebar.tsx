'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronRight, LogoutCircle01Icon } from '@hugeicons/core-free-icons';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { useLogoutMutation, useMeQuery, useSidebarStatsQuery } from '@/hooks';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '../ui';
import { Logo } from '../Logo';
import { routes } from './const';
import { RouteChild, Route, AppRouteWithChildren } from './types';
import { Link } from '../Link';
import { getActiveItem, matchesUrl } from './helpers';

interface AppSidebarProps {
  pathname: string | null;
}

export const AppSidebar = (props: AppSidebarProps) => {
  const { open, isMobile, setOpenMobile } = useSidebar();

  const pathname = usePathname();

  const sidebarStatsQuery = useSidebarStatsQuery();
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();

  const activeItem = getActiveItem(pathname || props.pathname || '/', true);

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-none outline-none py-5 md:px-2 bg-sidebar"
      innerClassName="gap-4"
    >
      <SidebarHeader>
        <Logo className="px-1" isCompact={!open && !isMobile} onClick={() => isMobile && setOpenMobile(false)} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {routes.map((item) => {
                if ('items' in item)
                  return <SubMenu key={item.title} item={item} activeItem={activeItem} pathname={pathname} />;

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn({
                      'bg-secondary rounded-lg': activeItem && 'url' in activeItem && activeItem.url === item.url,
                    })}
                  >
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <Link
                        prefetch
                        href={item.url}
                        onClick={() => isMobile && setOpenMobile(false)}
                        className="flex justify-between items-center pe-3.5"
                      >
                        <p className="flex gap-2 items-center">
                          {item.icon && <HugeiconsIcon icon={item.icon} />}

                          <span className="whitespace-nowrap capitalize text-sm">{item.title}</span>
                        </p>

                        {!!sidebarStatsQuery.data?.[item.url] && (
                          <span className="text-xxs font-semibold text-foreground">
                            {sidebarStatsQuery.data[item.url]}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-row gap-1 items-center">
        <div className="flex-1 grid gap-1 text-sm leading-tight">
          <span className="truncate font-medium">{meQuery.data?.name}</span>

          <span className="truncate text-xs">{meQuery.data?.email}</span>
        </div>

        <SidebarMenu className="w-fit">
          <SidebarMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton tooltip="Logout" disabled={logoutMutation.isPending}>
                  <HugeiconsIcon icon={LogoutCircle01Icon} className="size-6" />
                </SidebarMenuButton>
              </AlertDialogTrigger>

              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout</AlertDialogTitle>

                  <AlertDialogDescription>Are you sure you want to logout?</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction onClick={() => logoutMutation.mutate()}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

interface SubMenuProps {
  pathname: string;
  item: AppRouteWithChildren;
  activeItem: Route | RouteChild | null;
}

const SubMenu = ({ pathname, item, activeItem }: SubMenuProps) => {
  const sidebar = useSidebar();

  const sidebarStatsQuery = useSidebarStatsQuery();

  const [isOpen, setIsOpen] = useState(() => item.items.some((sub) => matchesUrl(sub.url, pathname)));

  const onOpenChange = (open: boolean) => {
    if (sidebar.open) return setIsOpen(open);

    sidebar.setOpen(true);
    setIsOpen(true);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={item.title} onClick={() => onOpenChange(!isOpen)}>
        {item.icon && <HugeiconsIcon icon={item.icon} />}

        <span className="whitespace-nowrap capitalize text-sm">{item.title}</span>

        <HugeiconsIcon
          icon={ChevronRight}
          className={cn('ms-auto transition-transform duration-200', { 'rotate-90': isOpen })}
        />
      </SidebarMenuButton>

      <SidebarMenuSub
        className={cn('max-h-0 overflow-hidden pointer-events-none py-0 pe-0 me-0 transition-all duration-500', {
          'max-h-250 pointer-events-auto my-0.5': isOpen,
        })}
      >
        {item.items.map((subItem) => (
          <SidebarMenuSubItem key={subItem.title}>
            <SidebarMenuSubButton asChild>
              <Link
                prefetch
                href={subItem.url}
                className={cn('flex items-center justify-between text-xs whitespace-nowrap', {
                  'bg-secondary rounded-lg': activeItem && 'url' in activeItem && activeItem.url === subItem.url,
                })}
                onClick={() => sidebar.isMobile && sidebar.setOpenMobile(false)}
              >
                {subItem.title}

                {!!sidebarStatsQuery.data?.[subItem.url] && (
                  <span className="text-xxs font-semibold text-foreground pe-1">
                    {sidebarStatsQuery.data[subItem.url]}
                  </span>
                )}
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
};
