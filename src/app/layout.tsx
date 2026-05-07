import type { Metadata } from 'next';
import { Oxanium } from 'next/font/google';
import HolyLoader from 'holy-loader';
import { headers } from 'next/headers';

import { Providers } from '@/components';
import { cn } from '@/lib/utils';
import { isLoggedInHeaderKey } from '@/proxy/const';

import './globals.css';

const oxanium = Oxanium({ subsets: ['latin'], variable: '--font-oxanium' });

export const metadata: Metadata = { title: 'Gamers Core | Admin' };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const isLoggedIn = headersList.get(isLoggedInHeaderKey) === 'true';

  return (
    <html lang="en" className={cn('h-full dark', 'antialiased', oxanium.variable)} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-svh flex flex-col transition-colors duration-300">
        <HolyLoader speed={500} showSpinner color="oklch(0.424 0.199 265.638)" />

        <Providers isLoggedIn={isLoggedIn}>{children}</Providers>
      </body>
    </html>
  );
}
