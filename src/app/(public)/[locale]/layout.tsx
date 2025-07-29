// app/(public)/[locale]/layout.tsx
import { ReactNode } from 'react';
import { getMessages } from 'next-intl/server';
import ClientAppProviders from './ClientAppProviders';

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
  params: { locale: 'en' | 'es' };
  children: ReactNode;
};

export default async function PublicLayout({ children, params }: Props) {
  // ⚠️ getMessages espera un objeto { locale: string }
  const messages = await getMessages({ locale: params.locale });

  return (
    <ClientAppProviders locale={params.locale} messages={messages}>
      {children}
    </ClientAppProviders>
  );
}
