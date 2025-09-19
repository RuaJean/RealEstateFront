"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

// Iconos SVG
const BuildingIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ArrowTrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

export default function Page() {
  const { accessToken } = useAuth();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <ChartIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bienvenido a tu panel de control inmobiliario</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Propiedades</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowTrendingUpIcon />
                  <span className="text-sm text-green-600 font-medium">+12% este mes</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                <BuildingIcon />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Propietarios</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowTrendingUpIcon />
                  <span className="text-sm text-green-600 font-medium">+5% este mes</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white">
                <UsersIcon />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowTrendingUpIcon />
                  <span className="text-sm text-green-600 font-medium">+8% este mes</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
                <ChartIcon />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nuevas este mes</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowTrendingUpIcon />
                  <span className="text-sm text-green-600 font-medium">+45% vs anterior</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white">
                <PlusIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/properties" 
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
                  <BuildingIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Propiedades</h3>
                  <p className="text-sm text-gray-600">Gestionar inventario</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Visualiza, edita y administra todas las propiedades de tu portafolio inmobiliario.
              </p>
              <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
                Ver todas las propiedades
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link 
              href="/owners" 
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-200">
                  <UsersIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Propietarios</h3>
                  <p className="text-sm text-gray-600">Gestionar contactos</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Administra la información de contacto y documentos de todos los propietarios.
              </p>
              <div className="mt-4 flex items-center text-purple-600 font-medium text-sm">
                Ver todos los propietarios
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link 
              href="/properties/new" 
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white group-hover:from-green-600 group-hover:to-green-700 transition-all duration-200">
                  <PlusIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Nueva Propiedad</h3>
                  <p className="text-sm text-gray-600">Agregar al inventario</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Registra una nueva propiedad en el sistema con toda su información y documentación.
              </p>
              <div className="mt-4 flex items-center text-green-600 font-medium text-sm">
                Crear nueva propiedad
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Nueva propiedad agregada</p>
                <p className="text-sm text-gray-600">Casa en Los Angeles, 3 habitaciones</p>
              </div>
              <span className="text-sm text-gray-500">Hace 2 horas</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Propietario actualizado</p>
                <p className="text-sm text-gray-600">Información de contacto de Juan Pérez</p>
              </div>
              <span className="text-sm text-gray-500">Hace 1 día</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Precio actualizado</p>
                <p className="text-sm text-gray-600">Apartamento en Manhattan: $850,000</p>
              </div>
              <span className="text-sm text-gray-500">Hace 2 días</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


