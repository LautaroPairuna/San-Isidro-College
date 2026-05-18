// app/(public)/[locale]/ClientAppProviders.tsx
'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import HeaderWrapper from '@/components/HeaderWrapper';

// Define bien el tipo de props
interface ClientAppProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, string>;
}

export default function ClientAppProviders({
  children,
  locale,
  messages
}: ClientAppProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HeaderWrapper />
      {children}
    </NextIntlClientProvider>
  );
}
