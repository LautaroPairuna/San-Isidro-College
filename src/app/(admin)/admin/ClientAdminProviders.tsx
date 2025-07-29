// src/app/(admin)/admin/ClientAdminProviders.tsx
'use client';

import { ReactNode, useMemo, useState } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname }                from 'next/navigation';
import { QueryClient, QueryClientProvider }       from '@tanstack/react-query';
import Link                                      from 'next/link';
import Image                                     from 'next/image';
import type { IconType }                         from 'react-icons';
import {
  HiPhotograph,
  HiCollection,
  HiMenu,
  HiX,
  HiLogout,
} from 'react-icons/hi';

const RESOURCES = ['GrupoMedios', 'Medio'] as const;

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
  const avatarUrl   = session?.user?.image ?? '/avatar-placeholder.png';
  const displayName = session?.user?.name  ?? 'Usuario';

  const iconFor = (name: string): IconType => {
    if (/Medio|Photograph/.test(name))      return HiPhotograph;
    if (/GrupoMedios|Collection/.test(name)) return HiCollection;
    return HiPhotograph;
  };

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
            <Image src={avatarUrl} alt="Avatar" width={32} height={32} className="h-8 w-8 rounded-full object-cover"/>
            <button onClick={() => signOut({ callbackUrl: '/admin/auth' })} className="p-1 hover:bg-indigo-500 rounded">
              <HiLogout className="h-6 w-6 text-white"/>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-20 transform
            ${isRoot ? 'w-full' : 'w-64'} transition-transform duration-200
            bg-gradient-to-b from-indigo-800 to-indigo-900 text-white shadow-lg
            md:static md:translate-x-0
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          `}
        >
          <div className="h-full flex flex-col">
            <div className="hidden md:flex items-center px-6 py-6 border-b border-indigo-700">
              <HiCollection className="h-8 w-8 text-white"/>
              <span className="ml-3 text-2xl font-bold">Admin</span>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-2">
              {RESOURCES.map((r) => {
                const path   = `/admin/resources/${r}`;
                const active = rawPath === path;
                const label  = r === 'GrupoMedios' ? 'Grupos de Medios' : 'Medios';
                const Icon   = iconFor(r);

                return (
                  <Link
                    key={r}
                    href={path}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition
                      ${active
                        ? 'bg-indigo-700 text-white font-semibold'
                        : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'}
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0"/>
                    <span className="ml-3">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-indigo-700 p-4">
              <button
                onClick={() => signOut({ callbackUrl: '/admin/auth' })}
                className="w-full flex items-center px-4 py-3 bg-indigo-700 hover:bg-indigo-600 rounded-lg transition"
              >
                <HiLogout className="h-5 w-5 text-white"/>
                <span className="ml-3 text-white font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className={`${isRoot ? 'hidden' : 'flex-1 flex flex-col overflow-auto'}`}>
          <header className="hidden md:flex items-center justify-between bg-white border-b px-8 py-4 shadow-sm">
            <h1 className="text-xl font-semibold">
              {rawPath.split('/').pop() === 'GrupoMedios' ? 'Grupos de Medios' : 'Medios'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">¡Hola, {displayName}!</span>
              <Image src={avatarUrl} alt="Avatar" width={32} height={32} className="h-8 w-8 rounded-full object-cover"/>
            </div>
          </header>
          <div className="flex-1 p-6 md:p-8 bg-gray-50">{children}</div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
