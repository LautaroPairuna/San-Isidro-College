// src/app/layout.tsx

import './globals.css'
import { ReactNode } from 'react'
import HeaderWrapper from '@/components/HeaderWrapper'
import ReactQueryProvider from '@/components/ReactQueryProvider';

export const metadata = {
  title: 'San Isidro College - Home',
  description:
    'San Isidro College es un colegio Bilingüe con un proyecto educativo sólido e innovador en Salta, Argentina.',
  keywords: [
    'colegio',
    'salta',
    'argentina',
    'bilingüe',
    'educación',
    'san isidro college',
  ],
  openGraph: {
    title: 'San Isidro College - Home',
    description:
      'San Isidro College es un colegio Bilingüe con un proyecto educativo sólido e innovador en Salta, Argentina.',
    url: 'https://tusitio.com',
    siteName: 'San Isidro College',
    images: [
      {
        url: 'https://tusitio.com/images/cover.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'San Isidro College - Home',
    description:
      'San Isidro College es un colegio Bilingüe con un proyecto educativo sólido e innovador en Salta, Argentina.',
    images: ['https://tusitio.com/images/cover.jpg'],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="author" content="San Isidro College" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          html,
          body {
            margin: 0;
            width: 100%;
            height: 100%;
            background-color: white;
            scroll-behavior: smooth;
          }
        `}</style>
      </head>
      <body>
        {/* En lugar de <Header />, usamos este wrapper */}
        <HeaderWrapper />
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}
