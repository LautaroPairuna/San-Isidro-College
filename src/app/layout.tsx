// app/layout.tsx
import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';
import localFont from 'next/font/local';

// Configuración de fuentes locales (Gotham)
const gotham = localFont({
  src: [
    {
      path: '../../public/fonts/GothamLight.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GothamBook.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GothamBookItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/GothamBold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GothamBoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-gotham', // Variable CSS para Tailwind
  display: 'swap',
});

// Configuración de fuente Acumin (Variable)
const acumin = localFont({
  src: '../../public/fonts/Acumin-Variable-Concept.woff2',
  variable: '--font-acumin',
  weight: '100 900',
  display: 'swap',
});

// Configuración de fuente Harlows
const harlows = localFont({
  src: '../../public/fonts/HARLOWSI.woff2',
  variable: '--font-harlows',
  display: 'swap',
});

export const metadata = {
  title: 'Colegio San Isidro',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${gotham.variable} ${acumin.variable} ${harlows.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body className="font-gotham antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
