import { IconSvgElement } from '@hugeicons/react';
import { routes } from './const';

export interface RouteChild {
  title: string;
  url: string;
  items?: RouteChild[];
  badge?: (sidebarStats: Record<string, number>) => string;
}

export interface RouteURL {
  title: string;
  icon: IconSvgElement;
  url: string;
}

export interface RouteWithChildren {
  title: string;
  icon: IconSvgElement;
  items: RouteChild[];
}

export type Route = RouteURL | RouteWithChildren;

type AppRoute = (typeof routes)[number];
export type AppRouteURL = Extract<AppRoute, RouteURL>;
export type AppRouteWithChildren = Extract<AppRoute, RouteWithChildren>;
export type RouteURLPath = AppRouteURL['url'] | AppRouteWithChildren['items'][number]['url'];
