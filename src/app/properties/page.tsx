"use client";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyFilter from "@/components/property/PropertyFilter";
import PropertyCard from "@/components/property/PropertyCard";
import { useProperties } from "@/hooks/useProperties";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

  const filters = useMemo(() => {
    return {
      text: params.get("text") ?? undefined,
      priceMin: params.get("priceMin") ? Number(params.get("priceMin")) : undefined,
      priceMax: params.get("priceMax") ? Number(params.get("priceMax")) : undefined,
      page: params.get("page") ? Number(params.get("page")) : 1,
      pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : 10,
      ownerId: params.get("ownerId") ?? undefined,
      year: params.get("year") ? Number(params.get("year")) : undefined,
    };
  }, [params]);

  const { properties, isLoading, page, pageSize, total } = useProperties(filters);

  const goToPage = (page: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(page));
    router.push(`/properties?${next.toString()}`);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Propiedades</h1>
      <PropertyFilter />
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        <button className="border rounded px-3 py-1" onClick={() => goToPage(Math.max(1, (filters.page ?? 1) - 1))}>
          Anterior
        </button>
        <span className="text-sm text-neutral-600">
          Página {page} — Mostrando {properties.length} de {total}
        </span>
        <button className="border rounded px-3 py-1" onClick={() => goToPage((filters.page ?? 1) + 1)}>
          Siguiente
        </button>
      </div>
    </main>
  );
}


