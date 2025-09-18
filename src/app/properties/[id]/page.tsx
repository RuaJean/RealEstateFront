"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPropertyById } from "@/services/property.service";
import PropertyImageGallery from "@/components/property/PropertyImageGallery";
import PropertyTraceTable from "@/components/property/PropertyTraceTable";
import OwnerCard from "@/components/owner/OwnerCard";
import type { Property } from "@/models/Property";

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
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <main className="p-6">Cargando...</main>;
  if (!property) return <main className="p-6">No se encontró la propiedad.</main>;

  return (
    <main className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PropertyImageGallery propertyId={property.id!} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{property.name}</h1>
          <p className="text-neutral-700">{property.street}, {property.city}, {property.country}</p>
          <p className="text-lg">{property.price} {property.currency}</p>
          {property.ownerId && <OwnerCard ownerId={property.ownerId} />}
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Historial</h2>
        <PropertyTraceTable propertyId={property.id!} />
      </section>
    </main>
  );
}


