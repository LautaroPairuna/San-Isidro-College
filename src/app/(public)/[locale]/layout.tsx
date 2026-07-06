// app/(public)/[locale]/layout.tsx
// Root layout del sitio público. Tener el <html> acá (y no en app/layout.tsx)
// permite fijar el locale con setRequestLocale() sin leer headers(), que es lo
// que habilita el render estático/ISR de las páginas públicas (clave para RAM).
import '@/app/globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import ClientAppProviders from './ClientAppProviders';
import FloatingAdmissionsButton from '@/components/FloatingAdmissionsButton';
import SeoJsonLd from '@/components/SeoJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import { fontVariables } from '@/lib/fonts';

type Props = {
  // Next.js 15+: params es asincrónico
  params: Promise<{ locale: string }>;
  children: ReactNode;
};

// Marca la ruta como estática/ISR. Devuelve [] a propósito: no prerenderizamos
// en build (la DB no es accesible ahí y quedarían páginas vacías cacheadas);
// cada página se genera en el primer request y queda cacheada (ISR).
export function generateStaticParams(): Array<{ locale: string }> {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.home' });
  return buildPageMetadata({
    locale,
    href: '/',
    title: t('title'),
    description: t('description'),
  });
}

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Fija el locale del request para que getTranslations()/getMessages() no
  // dependan de headers(): sin esto, cada página se vuelve dinámica.
  setRequestLocale(locale);

  // ⚠️ getMessages espera un objeto { locale: string }
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body className="font-gotham antialiased">
        <ClientAppProviders locale={locale} messages={messages}>
          <SeoJsonLd locale={locale} />
          {children}
          <FloatingAdmissionsButton />
        </ClientAppProviders>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
