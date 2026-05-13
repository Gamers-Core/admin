import { routes } from './const';
import { Route, RouteChild } from './types';

export const matchesUrl = (url: string, pathname: string) => pathname === url || pathname.startsWith(url + '/');

const findTrail = (items: RouteChild[], pathname: string, shallow = false): RouteChild[] | null => {
  for (const child of items) {
    if (matchesUrl(child.url, pathname)) return [child];

    if (!shallow && 'items' in child && child.items) {
      const nested = findTrail(child.items, pathname);
      if (nested) return [child, ...nested];
    }
  }

  return null;
};

export const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const base = '/' + (segments[0] ?? '');

  const knownCrumbs: { title: string; url?: string }[] = [];

  for (const route of routes) {
    if ('items' in route) {
      const trail = findTrail(route.items, base);

      if (trail) {
        knownCrumbs.push({ title: route.title });
        knownCrumbs.push(...trail.map((c) => ({ title: c.title, url: c.url })));

        break;
      }
    } else if (route.url === base) {
      knownCrumbs.push({ title: route.title, url: route.url });

      break;
    }
  }

  const extraCrumbs = segments.slice(knownCrumbs.length - 1).map((seg, i) => ({
    title: seg.charAt(0).toUpperCase() + seg.slice(1),
    url: '/' + segments.slice(0, knownCrumbs.length + i).join('/'),
  }));

  return [...knownCrumbs, ...extraCrumbs];
};

export const getActiveItem = (pathname: string, shallow = false): Route | RouteChild | null => {
  for (const route of routes) {
    if ('items' in route) {
      const trail = findTrail(route.items, pathname, shallow);

      if (trail) return trail[trail.length - 1];
    } else if (matchesUrl(route.url, pathname)) return route;
  }

  return null;
};
