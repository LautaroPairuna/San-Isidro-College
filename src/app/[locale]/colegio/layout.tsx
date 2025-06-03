// app/colegio/layout.tsx
import { ReactNode } from 'react';

export const metadata = {
  title: 'Colegio - San Isidro College',
  description: 'Página Colegio',
};

export default function ColegioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
