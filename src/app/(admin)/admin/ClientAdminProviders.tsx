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
  HiHome,
  HiTemplate,
  HiGlobeAlt,
} from 'react-icons/hi';

// Enlaces del sidebar normalizados: cada recurso con su label amigable
// (consistente con el Dashboard) y el nombre de tabla usado en las rutas.
const RESOURCES: { name: string; label: string }[] = [
  { name: 'GrupoMedios', label: 'Grupos de Medios' },
  { name: 'Medio',       label: 'Medios Individuales' },
  { name: 'Seccion',     label: 'Secciones de Página' },
];

interface ClientAdminProvidersProps {
  children: ReactNode;
}

const DefaultAvatar = ({ className }: { className?: string }) => (
  <div
    className={`rounded-full bg-gold-500 text-brand-900 flex items-center justify-center font-bold border-2 border-gold-300 ${className ?? ''}`}
  >
    ES
  </div>
);

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

  const { status } = useSession({
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
      <div className="flex items-center justify-center h-screen bg-brand-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-brand-600" />
        <span className="ml-4 text-brand-800">Verificando sesión…</span>
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

  const linkBase =
    'flex items-center px-4 py-3 rounded-lg transition-colors border-l-4';
  const linkActive = 'bg-brand-700/70 text-white border-gold-400 shadow-sm';
  const linkIdle =
    'text-brand-100 border-transparent hover:bg-brand-700/50 hover:text-white';

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-brand-50 text-navy-800">
        {/* Barra móvil */}
        <div className="md:hidden flex items-center justify-between bg-brand-700 text-white p-4 shadow-md">
          <button onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
            {mobileOpen ? <HiX className="h-6 w-6"/> : <HiMenu className="h-6 w-6"/>}
          </button>
          <span className="text-lg font-semibold">Panel San Isidro</span>
          <div className="flex items-center space-x-3">
            <DefaultAvatar className="h-8 w-8 text-xs" />
            <button onClick={() => signOut({ callbackUrl: '/admin/auth' })} className="p-1 hover:bg-brand-600 rounded" aria-label="Cerrar sesión">
              <HiLogout className="h-6 w-6 text-white"/>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-20 transform
            ${isRoot ? 'w-full md:w-64' : 'w-64'} transition-transform duration-200
            bg-gradient-to-b from-brand-800 to-brand-900 text-white shadow-xl
            md:static md:translate-x-0
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          `}
        >
          <div className="h-full flex flex-col">
            {/* Header Sidebar con logo institucional */}
            <div className="flex items-center justify-center h-24 px-6 border-b border-white/10 bg-brand-900/40">
              <Image
                src="/images/logo-san-isidro-3.svg"
                alt="San Isidro College"
                width={408}
                height={194}
                priority
                className="h-14 w-auto"
              />
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto bg-gradient-to-b from-navy-700 to-navy-800">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`${linkBase} ${rawPath === '/admin' ? linkActive : linkIdle}`}
              >
                <HiHome className="mr-3 h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <div className="pt-5 pb-2">
                <p className="px-4 text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  Recursos
                </p>
              </div>

              {RESOURCES.map(({ name, label }) => {
                const Icon = iconFor(name);
                const isActive = rawPath.includes(`/admin/resources/${name}`);
                return (
                  <Link
                    key={name}
                    href={`/admin/resources/${name}`}
                    onClick={() => setMobileOpen(false)}
                    className={`${linkBase} ${isActive ? linkActive : linkIdle}`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                );
              })}

              {/* Volver al sitio público */}
              <div className="pt-4 mt-4 border-t border-white/10">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={`${linkBase} ${linkIdle}`}
                >
                  <HiGlobeAlt className="mr-3 h-5 w-5" />
                  <span className="font-medium">Ver sitio web</span>
                </Link>
              </div>
            </nav>

            {/* Footer Sidebar (User info desktop) */}
            <div className="hidden md:flex flex-col p-4 bg-brand-900/60 border-t border-white/10">
              <div className="flex items-center space-x-3 mb-3">
                <DefaultAvatar className="h-10 w-10 text-sm" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{displayName}</p>
                  <p className="text-xs text-brand-200 truncate">Administrador</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/auth' })}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-brand-700 rounded-lg hover:bg-brand-600 transition-colors"
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
