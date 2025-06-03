// /app/[locale]/layout.tsx
import '@/app/globals.css'
import HeaderWrapper from '@/components/HeaderWrapper'
import ReactQueryProvider from '@/components/ReactQueryProvider'

import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export const metadata = {
  title: 'San Isidro College – Home',
  description:
    'San Isidro College es un colegio Bilingüe con un proyecto educativo sólido e innovador en Salta, Argentina.',
  openGraph: {
    title: 'San Isidro College – Home',
    description:
      'San Isidro College es un colegio Bilingüe con un proyecto educativo sólido e innovador en Salta, Argentina.',
    locale: 'es_ES',
    type: 'website',
    url: 'https://tusitio.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'San Isidro College – Home',
    description:
      'San Isidro College es un colegio Bilingüe con un proyecto educativo sólido e innovador en Salta, Argentina.',
  },
}

type ValidLocale = 'en' | 'es'

interface Props {
  params: { locale: ValidLocale }
  children: ReactNode
}

export function generateStaticParams() {
  return [
    { locale: 'en' as ValidLocale },
    { locale: 'es' as ValidLocale },
  ]
}

export default async function RootLayout(props: Props) {
  const locale = props.params.locale
  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html,body { margin:0; width:100%; height:100%; background:#fff; scroll-behavior:smooth }
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <HeaderWrapper />
          <ReactQueryProvider>{props.children}</ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
