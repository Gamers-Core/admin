import { IconSvgElement } from '@hugeicons/react';
import { ReactNode } from 'react';

export interface RouteChild {
  title: string;
  url: string;
  cta?: () => ReactNode;
  items?: RouteChild[];
}

export interface RouteURL {
  title: string;
  icon: IconSvgElement;
  url: string;
  cta?: () => ReactNode;
}

export interface RouteWithChildren {
  title: string;
  icon: IconSvgElement;
  items: RouteChild[];
}

export type Route = RouteURL | RouteWithChildren;
