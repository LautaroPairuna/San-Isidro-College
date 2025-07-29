// app/vida-estudiantil/layout.tsx
'use client';                            // ← ❶  Hacemos el layout “cliente”

import { ReactNode } from 'react';
import ReactQueryProvider from '@/components/ReactQueryProvider';  // ← ❷  Provider que crea el QueryClient

export default function VidaEstudiantilLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    /* ❸  Envolvemos con ReactQueryProvider solo esta sección */
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  );
}
