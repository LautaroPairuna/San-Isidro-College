'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  HiPhotograph,
  HiCollection,
  HiClock,
  HiArrowRight,
} from 'react-icons/hi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardStats {
  counts: {
    grupos: number;
    medios: number;
  };
  recentActivity: Array<{
    id: number;
    urlArchivo: string;
    tipo: string;
    actualizadoEn: string;
    grupoMedios: {
      nombre: string;
    };
  }>;
}

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Error al cargar estadísticas');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        Error al cargar el dashboard: {(error as Error).message}
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Grupos',
      value: data?.counts.grupos || 0,
      icon: HiCollection,
      color: 'bg-blue-500',
      href: '/admin/resources/GrupoMedios',
    },
    {
      name: 'Total Medios',
      value: data?.counts.medios || 0,
      icon: HiPhotograph,
      color: 'bg-green-500',
      href: '/admin/resources/Medio',
    },
  ];

  return (
    <div className="w-full p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-500 mt-1">
            Resumen de actividad y accesos directos.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-indigo-700 font-medium flex items-center">
                Ver detalles <HiArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center">
          <HiClock className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Últimos Medios Actualizados
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Archivo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Grupo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No hay actividad reciente.
                  </td>
                </tr>
              ) : (
                data?.recentActivity.map((medio) => (
                  <tr key={medio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medio.urlArchivo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medio.grupoMedios.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          medio.tipo === 'VIDEO'
                            ? 'bg-purple-100 text-purple-800'
                            : medio.tipo === 'ICONO'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {medio.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(medio.actualizadoEn), 'PPp', {
                        locale: es,
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
