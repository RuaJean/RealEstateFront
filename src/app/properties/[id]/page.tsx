"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPropertyById } from "@/services/property.service";
import PropertyImageGallery from "@/components/property/PropertyImageGallery";
import PropertyTraceTable from "@/components/property/PropertyTraceTable";
import OwnerCard from "@/components/owner/OwnerCard";
import type { Property } from "@/models/Property";
import PropertyTraceForm from "@/components/property/PropertyTraceForm";

// Iconos SVG
const BuildingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPropertyById(id);
        if (mounted) setProperty(data);
      } catch (error) {
        console.error("Error loading property:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-gray-600">
              <LoaderIcon />
              <span className="text-lg font-medium">Cargando propiedad...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
              <BuildingIcon />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Propiedad no encontrada</h3>
            <p className="text-gray-600 mb-6">La propiedad que buscas no existe o ha sido eliminada</p>
            <Link 
              href="/properties"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200"
            >
              <BackIcon />
              Volver a Propiedades
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/properties" className="hover:text-gray-900 transition-colors">
              Propiedades
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {property.name}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <Link 
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md w-fit"
            >
              <BackIcon />
              Volver
            </Link>

            <Link 
              href={`/properties/${property.id}/edit`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl w-fit"
            >
              <EditIcon />
              Editar Propiedad
            </Link>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              <PropertyImageGallery propertyId={property.id!} />
            </div>
          </div>
          
          {/* Property Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <BuildingIcon />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <LocationIcon />
                    <span className="text-sm">
                      {[property.street, property.city, property.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Precio</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {property.price?.toLocaleString()} {property.currency || "USD"}
                  </p>
                </div>

                {property.area && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Área</p>
                      <p className="text-xl font-bold text-gray-900">{property.area} m²</p>
                    </div>
                    {property.year && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-600 mb-1">Año</p>
                        <p className="text-xl font-bold text-gray-900">{property.year}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Owner Info */}
            {property.ownerId && (
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl">
                <OwnerCard ownerId={property.ownerId} />
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de la Propiedad</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Registro</h3>
              <PropertyTraceForm propertyId={property.id!} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registros Anteriores</h3>
              <PropertyTraceTable propertyId={property.id!} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


