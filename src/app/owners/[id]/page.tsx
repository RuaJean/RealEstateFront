"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import OwnerForm from "@/components/owner/OwnerForm";
import { createOwner, getOwnerById, updateOwner } from "@/services/owner.service";
import type { Owner } from "@/models/Owner";

// Iconos SVG
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === "new";
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let mounted = true;
    (async () => {
      try {
        const data = await getOwnerById(id);
        if (mounted) setOwner(data);
      } catch (error) {
        if (mounted) {
          alert("Error al cargar el propietario");
          router.push("/owners");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, isNew, router]);

  const onSubmit = async (values: { name: string; address: string; photo?: string }) => {
    setSubmitting(true);
    try {
      if (isNew) {
        await createOwner(values);
      } else if (owner?.id) {
        await updateOwner(owner.id, values);
      }
      router.push("/owners");
    } catch (error) {
      alert(isNew ? "Error al crear el propietario" : "Error al actualizar el propietario");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isNew && loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-gray-600">
              <LoaderIcon />
              <span className="text-lg font-medium">Cargando propietario...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/owners" className="hover:text-gray-900 transition-colors">
              Propietarios
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {isNew ? "Nuevo" : "Editar"}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Link 
              href="/owners"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <BackIcon />
              Volver
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white">
              <UserIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isNew ? "Nuevo Propietario" : "Editar Propietario"}
              </h1>
              <p className="text-gray-600">
                {isNew 
                  ? "Completa la información para registrar un nuevo propietario" 
                  : `Modifica la información de ${owner?.name || "este propietario"}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 lg:p-8">
          <OwnerForm 
            defaultValues={owner ?? undefined} 
            onSubmit={onSubmit} 
            submitting={submitting} 
          />
        </div>
      </div>
    </main>
  );
}


