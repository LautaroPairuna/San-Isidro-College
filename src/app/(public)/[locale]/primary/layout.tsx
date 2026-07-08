import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.primary' })
  return buildPageMetadata({ locale, href: '/primary', title: t('title'), description: t('description') })
}

export default function PrimaryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
