// app/(admin)/layout.tsx
// Root layout del panel de administración (grupo de rutas con su propio <html>).
// El sitio público tiene el suyo en (public)/[locale]/layout.tsx.
import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';
import { getBaseUrl, siteConfig } from '@/lib/siteConfig';
import { fontVariables } from '@/lib/fonts';

export const metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
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
