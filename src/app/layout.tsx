import type { Metadata } from 'next';
import { Oxanium } from 'next/font/google';
import HolyLoader from 'holy-loader';

import { Providers } from '@/components';
import { cn } from '@/lib/utils';

import './globals.css';

const oxanium = Oxanium({ subsets: ['latin'], variable: '--font-oxanium' });

export const metadata: Metadata = { title: 'Gamers Core | Admin' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn('h-full dark', 'antialiased', oxanium.variable)} suppressHydrationWarning>
      <HolyLoader speed={500} showSpinner color="oklch(0.424 0.199 265.638)" />

      <body suppressHydrationWarning className="min-h-svh flex flex-col transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
