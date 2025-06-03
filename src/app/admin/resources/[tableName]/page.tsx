// src/app/admin/resources/[tableName]/page.tsx
import { use } from 'react'
import ResourceDetailClient from './ResourceDetailClient'

// `params` aquí es Promise<{ tableName: string }>
export default function ResourceDetailPage({
  params,
}: {
  params: Promise<{ tableName: string }>
}) {
  // desempaquetamos la Promise con React.use()
  const { tableName } = use(params)

  // Convertimos el string genérico a uno de los literales aceptados
  const tn = tableName as 'GrupoMedios' | 'Medio'

  return <ResourceDetailClient tableName={tn} />
}
