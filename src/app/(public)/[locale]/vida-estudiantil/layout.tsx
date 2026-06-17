// app/(public)/[locale]/vida-estudiantil/layout.tsx
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.vidaEstudiantil' });
  return buildPageMetadata({ locale, path: 'vida-estudiantil', title: t('title'), description: t('description') });
}

export default function VidaEstudiantilLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
