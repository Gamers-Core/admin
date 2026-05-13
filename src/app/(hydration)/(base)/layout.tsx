import { headers } from 'next/headers';

import { AppSidebar, SidebarInset, SidebarProvider, TopBar } from '@/components';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = (await headers()).get('x-pathname');

  return (
    <SidebarProvider className="md:p-2 ps-0 h-dvh">
      <AppSidebar pathname={pathname} />

      <div className="flex flex-col flex-1 bg-background md:rounded-2xl min-h-0 overflow-hidden">
        <TopBar pathname={pathname} />

        <SidebarInset className="flex-1 md:m-0! overflow-y-auto">
          <div className="flex-1 flex flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
