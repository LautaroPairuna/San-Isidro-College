// app/(public)/[locale]/layout.tsx
import { ReactNode } from 'react';
import { getMessages } from 'next-intl/server';
import ClientAppProviders from './ClientAppProviders';
import FloatingAdmissionsButton from '@/components/FloatingAdmissionsButton';

export const metadata = {
  title: 'San Isidro College – Home',
  description:
    'San Isidro College es un colegio bilingüe con un proyecto educativo sólido e innovador en Salta, Argentina.',
  openGraph: {
    title: 'San Isidro College – Home',
    description:
      'San Isidro College es un colegio bilingüe con un proyecto educativo sólido e innovador en Salta, Argentina.',
    locale: 'es_ES',
    type: 'website',
    url: 'https://tusitio.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'San Isidro College – Home',
    description:
      'San Isidro College es un colegio bilingüe con un proyecto educativo sólido e innovador en Salta, Argentina.',
  },
};

type Props = {
  // Next.js 15+: params es asincrónico
  params: Promise<{ locale: string }>;
  children: ReactNode;
};

export default async function PublicLayout({ children, params }: Props) {
  // ⚠️ getMessages espera un objeto { locale: string }
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <ClientAppProviders locale={locale} messages={messages}>
      {children}
      <FloatingAdmissionsButton />
    </ClientAppProviders>
  );
}
