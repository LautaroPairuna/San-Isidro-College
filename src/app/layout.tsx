// app/layout.tsx
import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Colegio San Isidro',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
