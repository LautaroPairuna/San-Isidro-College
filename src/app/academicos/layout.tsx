// app/vida-estudiantil/layout.tsx
import { ReactNode } from 'react';

export const metadata = {
  title: 'Vida Estudiantil - San Isidro College',
  description: 'Página Vida Estudiantil',
};

export default function VidaEstudiantilLayout({
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
