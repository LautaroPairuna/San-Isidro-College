import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.experienciaSicInnovacionRobotica' })

  return buildPageMetadata({
    locale,
    href: '/experiencia-sic/innovacion-y-robotica',
    title: t('title'),
    description: t('description'),
  })
}

export default function ExperienciaSicInnovacionRoboticaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
