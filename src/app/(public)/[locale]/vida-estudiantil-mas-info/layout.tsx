// app/(public)/[locale]/vida-estudiantil-mas-info/layout.tsx
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.vidaEstudiantilMasInfo' });
  return buildPageMetadata({ locale, href: '/vida-estudiantil-mas-info', title: t('title'), description: t('description') });
}

export default function VidaEstudiantilMasInfoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
