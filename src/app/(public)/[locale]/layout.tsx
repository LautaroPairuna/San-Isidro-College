// app/(public)/[locale]/layout.tsx
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getMessages, getTranslations } from 'next-intl/server';
import ClientAppProviders from './ClientAppProviders';
import FloatingAdmissionsButton from '@/components/FloatingAdmissionsButton';
import SeoJsonLd from '@/components/SeoJsonLd';
import { buildPageMetadata } from '@/lib/seo';

type Props = {
  // Next.js 15+: params es asincrónico
  params: Promise<{ locale: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.home' });
  return buildPageMetadata({
    locale,
    path: '',
    title: t('title'),
    description: t('description'),
  });
}

export default async function PublicLayout({ children, params }: Props) {
  // ⚠️ getMessages espera un objeto { locale: string }
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <ClientAppProviders locale={locale} messages={messages}>
      <SeoJsonLd locale={locale} />
      {children}
      <FloatingAdmissionsButton />
    </ClientAppProviders>
  );
}
