"use client";
import type { Property } from "@/models/Property";
import Image from "next/image";
import { useEffect, useState } from "react";
import { listImagesByProperty } from "@/services/propertyImage.service";

export default function PropertyCard({ property }: { property: Property }) {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!property.id) return;
        const imgs = await listImagesByProperty(property.id);
        const firstEnabled = imgs.find((i) => i.enabled);
        if (mounted) setThumb(firstEnabled?.url ?? null);
      } catch {
        if (mounted) setThumb(null);
      }
    })();
    return () => { mounted = false; };
  }, [property.id]);

  return (
    <div className="border rounded overflow-hidden">
      <div className="relative w-full aspect-video bg-neutral-100">
        {thumb ? (
          <Image src={thumb} alt={property.name ?? "property"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">Sin imagen</div>
        )}
      </div>
      <div className="p-4 space-y-1">
        <h3 className="font-semibold">{property.name}</h3>
        <p className="text-sm text-neutral-700">{property.street}, {property.city}</p>
        <p className="text-sm">{property.price} {property.currency}</p>
      </div>
    </div>
  );
}


