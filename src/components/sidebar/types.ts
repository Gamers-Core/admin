import { IconSvgElement } from '@hugeicons/react';

export interface RouteChild {
  title: string;
  url: string;
  items?: RouteChild[];
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
