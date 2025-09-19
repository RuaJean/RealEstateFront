"use client";
import type { Property } from "@/models/Property";
import Image from "next/image";
import { useEffect, useState } from "react";
import { listImagesByProperty } from "@/services/propertyImage.service";
import Link from "next/link";

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

  const content = (
    <>
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        {thumb ? (
          <Image 
            src={thumb} 
            alt={property.name ?? "property"} 
            fill 
            className="object-cover transition-transform duration-300 hover:scale-105" 
            sizes="(max-width: 768px) 100vw, 33vw" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">Sin imagen</span>
            </div>
          </div>
        )}
        
        {/* Badge de precio destacado */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <p className="text-sm font-bold text-gray-900">
            {property.price?.toLocaleString()} <span className="text-xs font-medium text-gray-600">{property.currency || "USD"}</span>
          </p>
        </div>
      </div>
      
      <div className="p-5 space-y-3 bg-white">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {property.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-medium text-gray-700 truncate">
              {[property.street, property.city].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
        
        {/* Información adicional */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          {property.area && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{property.area} m²</span>
            </div>
          )}
          {property.year && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{property.year}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return property.id ? (
    <Link 
      href={`/properties/${property.id}`} 
      className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-sm hover:border-gray-300"
    >
      {content}
    </Link>
  ) : (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {content}
    </div>
  );
}


