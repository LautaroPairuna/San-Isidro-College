'use client';

import Link from 'next/link';
import { HiCollection, HiPhotograph, HiTemplate } from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';

// Dashboard simple que muestra resumen de recursos
export default function AdminDashboard() {
  // Opcional: podrías fetchear conteos reales si tienes endpoints para ello
  // const { data: stats } = useQuery(...)

  const cards = [
    {
      title: 'Grupos de Medios',
      description: 'Gestiona colecciones de imágenes y videos para carruseles y galerías.',
      href: '/admin/resources/GrupoMedios',
      icon: HiCollection,
      color: 'bg-blue-500',
    },
    {
      title: 'Medios Individuales',
      description: 'Sube y administra archivos multimedia (fotos, videos, íconos).',
      href: '/admin/resources/Medio',
      icon: HiPhotograph,
      color: 'bg-green-500',
    },
    {
      title: 'Secciones de Página',
      description: 'Administra el contenido dinámico de las páginas (textos, galerías, héroes).',
      href: '/admin/resources/Seccion',
      icon: HiTemplate,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Panel</h1>
        <p className="mt-2 text-gray-600">
          Selecciona un recurso para comenzar a administrar el contenido del sitio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="p-6 flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${card.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <card.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Link>
        ))}
      </div>

      <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">Consejos rápidos</h3>
        <ul className="list-disc list-inside space-y-2 text-indigo-800">
          <li>Usa <strong>Grupo de Medios</strong> para crear sliders o galerías nuevas.</li>
          <li>Asegúrate de usar nombres descriptivos en los archivos para mejorar el SEO.</li>
          <li>Si subes videos, intenta que no superen los 10MB para no afectar la velocidad del sitio.</li>
        </ul>
      </div>
    </div>
  );
}
