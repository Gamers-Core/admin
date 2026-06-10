import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useAppSettingsQuery } from '@/hooks';
import { MaintenanceMode } from '@/components';

export const metadata: Metadata = { title: 'Gamers Core | Settings' };

export default async function Settings() {
  const queryClient = new QueryClient();

  const [settings] = await Promise.all([queryClient.fetchQuery(useAppSettingsQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MaintenanceMode {...settings.maintenanceMode} />
    </HydrationBoundary>
  );
}
