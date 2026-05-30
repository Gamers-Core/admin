import { useQuery } from '@tanstack/react-query';

import { gamersCoreAdmin } from '@/api';
import { RouteURLPath } from '@/components';

type SidebarStats = Record<RouteURLPath, number | undefined>;

const queryKey = ['sidebar-stats'] as const;

const queryFn = async () => gamersCoreAdmin.get<SidebarStats>('/sidebar/stats').then((res) => res.data);

export const useSidebarStatsQuery = () =>
  useQuery({
    queryKey,
    queryFn,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 1000 * 60, // 1 minute,
  });

useSidebarStatsQuery.queryKey = queryKey;
useSidebarStatsQuery.queryFn = queryFn;
