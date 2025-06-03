// src/components/ReactQueryProvider.tsx
'use client';

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  /* Solo se crea una instancia por montaje */
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            // Puedes loguear errores globales aquí
            console.error('[TanStack Query] error:', error);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 min
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
