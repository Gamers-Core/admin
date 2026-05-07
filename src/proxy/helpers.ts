export const getIsAllowedPath = (pathname: string, allowedPaths: string[]) =>
  allowedPaths.some((path) => {
    if (path === '/') return pathname === path;

    return pathname.startsWith(path);
  });
