"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function PropertyFilter() {
  const router = useRouter();
  const params = useSearchParams();

  // Valores actuales desde el URL
  const urlText = params.get("text") ?? "";
  const urlPriceMin = params.get("priceMin") ?? "";
  const urlPriceMax = params.get("priceMax") ?? "";
  const page = params.get("page") ?? "1";
  const pageSize = params.get("pageSize") ?? "10";

  // Estado local para escritura fluida
  const [localText, setLocalText] = useState<string>(urlText);
  const [localPriceMin, setLocalPriceMin] = useState<string>(urlPriceMin);
  const [localPriceMax, setLocalPriceMax] = useState<string>(urlPriceMax);

  // Mantener sincronía si el URL cambia por fuera (paginación, navegación, etc.)
  useEffect(() => {
    if (urlText !== localText) setLocalText(urlText);
    if (urlPriceMin !== localPriceMin) setLocalPriceMin(urlPriceMin);
    if (urlPriceMax !== localPriceMax) setLocalPriceMax(urlPriceMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlText, urlPriceMin, urlPriceMax]);

  // Debounce: sincroniza filtros al URL sin interrumpir la escritura
  useEffect(() => {
    const handler = setTimeout(() => {
      const next = new URLSearchParams(params.toString());

      // Detectar si algún filtro cambió respecto al URL actual
      const changedText = (next.get("text") ?? "") !== localText;
      const changedMin = (next.get("priceMin") ?? "") !== localPriceMin;
      const changedMax = (next.get("priceMax") ?? "") !== localPriceMax;

      if (!changedText && !changedMin && !changedMax) return;

      if (localText) next.set("text", localText); else next.delete("text");
      if (localPriceMin) next.set("priceMin", localPriceMin); else next.delete("priceMin");
      if (localPriceMax) next.set("priceMax", localPriceMax); else next.delete("priceMax");

      // Si cambió algún filtro, resetear a la primera página
      next.set("page", "1");

      const current = params.toString();
      const target = next.toString();
      if (current !== target) {
        router.replace(`/properties?${target}`);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [localText, localPriceMin, localPriceMax, params, router]);

  const fields = useMemo(() => ({
    text: localText,
    priceMin: localPriceMin,
    priceMax: localPriceMax,
    page,
    pageSize,
  }), [localText, localPriceMin, localPriceMax, page, pageSize]);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Filtros de búsqueda</h3>
          <p className="text-sm text-gray-600">Refina tu búsqueda de propiedades</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por texto</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
            placeholder="Nombre, ciudad, dirección..."
            value={fields.text} 
            onChange={(e) => setLocalText(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio mínimo</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
            type="number" 
            placeholder="0"
            value={fields.priceMin} 
            onChange={(e) => setLocalPriceMin(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio máximo</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
            type="number" 
            placeholder="Sin límite"
            value={fields.priceMax} 
            onChange={(e) => setLocalPriceMax(e.target.value)} 
          />
        </div>
      </div>
      
      {(fields.text || fields.priceMin || fields.priceMax) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setLocalText("");
              setLocalPriceMin("");
              setLocalPriceMax("");
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}


