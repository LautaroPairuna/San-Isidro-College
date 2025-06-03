'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

export default function HeaderWrapper() {
  const pathname = usePathname() || ''

  // Si la ruta comienza con "/admin", no renderizamos ningún Header
  if (pathname.startsWith('/admin')) {
    return null
  }

  return <Header />
}