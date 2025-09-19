"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PropertyForm from "@/components/property/PropertyForm";
import ImageUploader from "@/components/property/ImageUploader";
import { getPropertyById, updateProperty, updatePropertyPrice, deleteProperty } from "@/services/property.service";
import type { Property, PropertyUpdate, PropertyPriceUpdate } from "@/models/Property";

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

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const DollarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
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
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState<string>("");
  const [updatingPrice, setUpdatingPrice] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPropertyById(id);
        if (mounted) {
          setProperty(data);
          setPrice((data.price ?? 0).toString());
        }
      } catch (error) {
        if (mounted) {
          alert("Error al cargar la propiedad");
          router.push("/properties");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, router]);

  const onSubmit = async (values: any) => {
    if (!property?.id) return;
    setSubmitting(true);
    try {
      const payload: PropertyUpdate = {
        name: values.name,
        street: values.street,
        city: values.city,
        state: values.state,
        country: values.country,
        zipCode: values.zipCode,
        year: values.year,
        area: values.area,
      } as PropertyUpdate;
      await updateProperty(property.id, payload);
      router.push(`/properties/${property.id}`);
    } catch (error) {
      alert("Error al actualizar la propiedad");
    } finally {
      setSubmitting(false);
    }
  };

  const onUpdatePrice = async () => {
    if (!property?.id || !price) return;
    setUpdatingPrice(true);
    try {
      const payload: PropertyPriceUpdate = { amount: Number(price), currency: property.currency ?? "USD" } as any;
      await updatePropertyPrice(property.id, payload);
      setProperty(prev => prev ? { ...prev, price: Number(price) } : null);
      alert("Precio actualizado correctamente");
    } catch (error) {
      alert("Error al actualizar el precio");
    } finally {
      setUpdatingPrice(false);
    }
  };

  const onDelete = async () => {
    if (!property?.id) return;
    if (!confirm("¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.")) return;
    try {
      await deleteProperty(property.id);
      router.push("/properties");
    } catch (error) {
      alert("Error al eliminar la propiedad");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
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
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
              <BuildingIcon />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Propiedad no encontrada</h3>
            <p className="text-gray-600 mb-6">La propiedad que intentas editar no existe o ha sido eliminada</p>
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
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/properties" className="hover:text-gray-900 transition-colors">
              Propiedades
            </Link>
            <span>/</span>
            <Link href={`/properties/${property.id}`} className="hover:text-gray-900 transition-colors truncate max-w-[150px]">
              {property.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Editar</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex gap-2">
              <Link 
                href="/properties"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <BackIcon />
                Volver
              </Link>
              <Link 
                href={`/properties/${property.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-xl transition-all duration-200"
              >
                <EyeIcon />
                Ver Propiedad
              </Link>
            </div>

            <button 
              onClick={onDelete}
              className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-all duration-200 w-fit"
            >
              <TrashIcon />
              Eliminar Propiedad
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <BuildingIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Propiedad</h1>
              <p className="text-gray-600">Modifica la información de {property.name}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Property Form */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 lg:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información General</h2>
            <PropertyForm defaultValues={property} onSubmit={onSubmit} submitting={submitting} />
          </div>

          {/* Price Update */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white">
                <DollarIcon />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Actualizar Precio</h2>
                <p className="text-gray-600">Precio actual: {property.price?.toLocaleString()} {property.currency || "USD"}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Precio ({property.currency || "USD"})
                </label>
                <input 
                  id="price"
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Ingresa el nuevo precio"
                />
              </div>
              <button 
                onClick={onUpdatePrice}
                disabled={updatingPrice || !price || Number(price) <= 0}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed sm:self-end"
              >
                {updatingPrice ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <DollarIcon />
                    Actualizar Precio
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Image Uploader */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 lg:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Imágenes de la Propiedad</h2>
            {property.id && (
              <ImageUploader
                propertyId={property.id}
                onUploaded={() => {
                  // Puede agregar lógica adicional aquí si es necesario
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


