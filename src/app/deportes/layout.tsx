// app/deportes/layout.tsx
import { ReactNode } from 'react';

export const metadata = {
  title: 'Deportes - San Isidro College',
  description: 'Página Deportes',
};

export default function DeportesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
