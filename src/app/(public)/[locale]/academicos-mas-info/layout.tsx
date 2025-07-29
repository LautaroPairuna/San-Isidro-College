// app/vida-estudiantil-mas-info/layout.tsx
import { ReactNode } from 'react';

export const metadata = {
  title: 'Vida Estudiantil - Más info | San Isidro College',
  description: 'Página Vida Estudiantil Más Info',
};

export default function VidaEstudiantilMasInfoLayout({
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
