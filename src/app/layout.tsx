import type { Metadata } from 'next';
import { Oxanium } from 'next/font/google';

import { cn } from '@/lib/utils';

import './globals.css';
import { Providers } from '@/components';

const oxanium = Oxanium({ subsets: ['latin'], variable: '--font-oxanium' });

export const metadata: Metadata = { title: 'Gamers Core | Admin' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn('h-full dark', 'antialiased', oxanium.variable)} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-svh flex flex-col transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
