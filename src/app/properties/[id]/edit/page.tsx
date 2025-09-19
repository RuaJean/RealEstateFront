"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PropertyForm from "@/components/property/PropertyForm";
import ImageUploader from "@/components/property/ImageUploader";
import { getPropertyById, updateProperty, updatePropertyPrice, deleteProperty } from "@/services/property.service";
import type { Property, PropertyUpdate, PropertyPriceUpdate } from "@/models/Property";

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPropertyById(id);
        if (mounted) {
          setProperty(data);
          setPrice((data.price ?? 0).toString());
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

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
    } finally {
      setSubmitting(false);
    }
  };

  const onUpdatePrice = async () => {
    if (!property?.id) return;
    const payload: PropertyPriceUpdate = { amount: Number(price), currency: property.currency ?? "USD" } as any;
    await updatePropertyPrice(property.id, payload);
    router.refresh();
  };

  const onDelete = async () => {
    if (!property?.id) return;
    if (!confirm("¿Eliminar propiedad?")) return;
    await deleteProperty(property.id);
    router.push("/properties");
  };

  if (loading) return <main className="p-6">Cargando...</main>;
  if (!property) return <main className="p-6">No encontrada</main>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Editar propiedad</h1>
      <PropertyForm defaultValues={property} onSubmit={onSubmit} submitting={submitting} />
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Imágenes</h2>
        {property.id && (
          <ImageUploader
            propertyId={property.id}
            onUploaded={() => {
              // Refrescar la página o la galería si estuviera presente
              router.refresh();
            }}
          />
        )}
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Actualizar precio</h2>
        <div className="flex items-center gap-2">
          <input className="border rounded p-2" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <button className="bg-black text-white px-3 py-2 rounded" onClick={onUpdatePrice}>Actualizar</button>
        </div>
      </section>
      <button className="text-red-600 underline" onClick={onDelete}>Eliminar propiedad</button>
    </main>
  );
}


