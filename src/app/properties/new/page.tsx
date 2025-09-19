"use client";
import { useState } from "react";
import Link from "next/link";
import PropertyForm from "@/components/property/PropertyForm";
import { createProperty } from "@/services/property.service";
import type { PropertyCreate } from "@/models/Property";
import { useRouter } from "next/navigation";

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

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const created = await createProperty(values as PropertyCreate);
      if (created?.id) {
        router.push(`/properties/${created.id}/edit`);
      } else {
        router.push("/properties");
      }
    } catch (error) {
      alert("Error al crear la propiedad");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/properties" className="hover:text-gray-900 transition-colors">
              Propiedades
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Nueva</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Link 
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <BackIcon />
              Volver
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <BuildingIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nueva Propiedad</h1>
              <p className="text-gray-600">Completa la información para registrar una nueva propiedad en el sistema</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 lg:p-8">
          <PropertyForm onSubmit={onSubmit} submitting={submitting} />
        </div>
      </div>
    </main>
  );
}


