// src/app/(admin)/admin/ClientAdminProviders.tsx
'use client';

import { ReactNode, useMemo, useState } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname }                from 'next/navigation';
import { QueryClient, QueryClientProvider }       from '@tanstack/react-query';
import Link                                      from 'next/link';
import type { IconType }                         from 'react-icons';
import {
  HiPhotograph,
  HiCollection,
  HiMenu,
  HiX,
  HiLogout,
  HiHome,
  HiTemplate,
} from 'react-icons/hi';

const RESOURCES = ['GrupoMedios', 'Medio', 'Seccion'] as const;

interface ClientAdminProvidersProps {
  children: ReactNode;
}

export default function ClientAdminProviders({ children }: ClientAdminProvidersProps) {
  return (
    <SessionProvider>
      <InnerAdminProviders>{children}</InnerAdminProviders>
    </SessionProvider>
  );
}

function InnerAdminProviders({ children }: ClientAdminProvidersProps) {
  const router      = useRouter();
  const rawPath     = usePathname() ?? '';
  const inAuthRoute = rawPath.startsWith('/admin/auth');

  const { data: session, status } = useSession({ 
    required: !inAuthRoute,
    onUnauthenticated() {
      if (!inAuthRoute) router.replace('/admin/auth');
    },
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const isRoot = rawPath === '/admin';
  const queryClient = useMemo(() => new QueryClient(), []);

  // Rutas de auth sin sidebar ni header
  if (inAuthRoute) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  // Spinner de carga de sesión
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600" />
        <span className="ml-4 text-gray-700">Verificando sesión…</span>
      </div>
    );
  }

  // Datos de usuario
  // Hardcoded por requerimiento del usuario
  const displayName = 'Esteban Siladji';

  const iconFor = (name: string): IconType => {
    if (name === 'Seccion') return HiTemplate;
    if (/Medio|Photograph/.test(name))      return HiPhotograph;
    if (/GrupoMedios|Collection/.test(name)) return HiCollection;
    return HiPhotograph;
  };

  const DefaultAvatar = ({ className }: { className?: string }) => (
    <div className={`rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold border-2 border-indigo-300 ${className}`}>
      ES
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100 text-gray-800">
        {/* Barra móvil */}
        <div className="md:hidden flex items-center justify-between bg-indigo-600 text-white p-4 shadow-md">
          <button onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
            {mobileOpen ? <HiX className="h-6 w-6"/> : <HiMenu className="h-6 w-6"/>}
          </button>
          <span className="text-lg font-semibold">Admin Panel</span>
          <div className="flex items-center space-x-3">
            <DefaultAvatar className="h-8 w-8 text-xs" />
            <button onClick={() => signOut({ callbackUrl: '/admin/auth' })} className="p-1 hover:bg-indigo-500 rounded">
              <HiLogout className="h-6 w-6 text-white"/>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-20 transform
            ${isRoot ? 'w-full md:w-64' : 'w-64'} transition-transform duration-200
            bg-gradient-to-b from-indigo-800 to-indigo-900 text-white shadow-lg
            md:static md:translate-x-0
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          `}
        >
          <div className="h-full flex flex-col">
            {/* Header Sidebar */}
            <div className="flex items-center justify-center h-20 shadow-md bg-indigo-900">
              <h1 className="text-2xl font-bold tracking-wider uppercase">Panel</h1>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <Link
                href="/admin"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  rawPath === '/admin'
                    ? 'bg-indigo-700 text-white shadow'
                    : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                }`}
              >
                <HiHome className="mr-3 h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Recursos
                </p>
              </div>

              {RESOURCES.map((resName) => {
                const Icon = iconFor(resName);
                const isActive = rawPath.includes(`/admin/resources/${resName}`);
                return (
                  <Link
                    key={resName}
                    href={`/admin/resources/${resName}`}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-700 text-white shadow'
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span className="font-medium">{resName}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer Sidebar (User info desktop) */}
            <div className="hidden md:flex flex-col p-4 bg-indigo-900 border-t border-indigo-800">
              <div className="flex items-center space-x-3 mb-3">
                <DefaultAvatar className="h-10 w-10 text-sm" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{displayName}</p>
                  <p className="text-xs text-indigo-300 truncate">Administrador</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/auth' })}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded hover:bg-indigo-600 transition-colors"
              >
                <HiLogout className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto relative flex flex-col">
          {/* Header Mobile (oculto en desktop) se maneja arriba, aquí solo el contenido */}
          <div className="flex-1 p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
