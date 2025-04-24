// app/deportes-mas-info/layout.tsx
import { ReactNode } from 'react';

export const metadata = {
  title: 'Deportes - Más info | San Isidro College',
  description: 'Página Deportes Más Info',
};

export default function DeportesMasInfoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
