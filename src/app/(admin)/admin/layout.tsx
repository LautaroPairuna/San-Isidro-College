// app/(admin)/admin/layout.tsx
import ClientAdminProviders from './ClientAdminProviders';

export const metadata = {
  title: 'Admin • Colegio San Isidro'
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientAdminProviders>
      {children}
    </ClientAdminProviders>
  );
}
