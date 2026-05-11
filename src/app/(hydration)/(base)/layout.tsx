import { headers } from 'next/headers';

import { AppSidebar, SidebarInset, SidebarProvider, TopBar } from '@/components';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = (await headers()).get('x-pathname');

  return (
    <SidebarProvider>
      <AppSidebar pathname={pathname} />

      <SidebarInset className="flex flex-col flex-1 bg-background md:m-2 ms-0! rounded-2xl">
        <TopBar pathname={pathname} />

        <main className="flex flex-1 w-full flex-col gap-4 p-4 py-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
