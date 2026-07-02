// app/(public)/[locale]/academicos-mas-info/layout.tsx
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.academicosMasInfo' });
  return buildPageMetadata({ locale, href: '/academicos-mas-info', title: t('title'), description: t('description') });
}

export default function AcademicosMasInfoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
