"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { listImagesByProperty } from "@/services/propertyImage.service";
import type { PropertyImage } from "@/models/Property";

export default function PropertyImageGallery({ propertyId }: { propertyId: string }) {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await listImagesByProperty(propertyId);
      if (mounted) setImages(data.filter((i) => i.enabled));
    })();
    return () => { mounted = false; };
  }, [propertyId]);

  const current = images[index];

  return (
    <div>
      <div className="relative w-full aspect-video bg-neutral-100 rounded overflow-hidden">
        {current ? (
          <Image src={current.url ?? ""} alt={current.description ?? "image"} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">Sin imágenes</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((img, i) => (
            <button key={img.id ?? i} onClick={() => setIndex(i)} className={`relative w-24 h-16 border ${i === index ? "border-black" : "border-transparent"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url ?? ""} alt={img.description ?? "thumb"} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


