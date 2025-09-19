"use client";
import { useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PropertyFilter from "@/components/property/PropertyFilter";
import PropertyCard from "@/components/property/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { listProperties } from "@/services/property.service";
import type { Property } from "@/models/Property";

// Iconos SVG
const BuildingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

  const filters = useMemo(() => {
    return {
      text: params.get("text") ?? undefined,
      priceMin: params.get("priceMin") ? Number(params.get("priceMin")) : undefined,
      priceMax: params.get("priceMax") ? Number(params.get("priceMax")) : undefined,
      page: params.get("page") ? Number(params.get("page")) : 1,
      pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : 12,
      ownerId: params.get("ownerId") ?? undefined,
      year: params.get("year") ? Number(params.get("year")) : undefined,
    };
  }, [params]);

  const { properties, isLoading, page, pageSize, hasNext, total } = useProperties(filters);

  // Exportación
  const [exportOpen, setExportOpen] = useState(false);
  const exportAnchorRef = useRef<HTMLButtonElement | null>(null);

  const fetchAllProperties = async (flt: typeof filters): Promise<Property[]> => {
    const size = 200;
    let current = 1;
    const all: Property[] = [];
    while (true) {
      const res = await listProperties({ ...flt, page: current, pageSize: size });
      const items = (res?.items ?? []) as Property[];
      all.push(...items);
      const stopBySize = items.length < size;
      const stopByTotal = res?.total ? all.length >= res.total : false;
      if (stopBySize || stopByTotal) break;
      current += 1;
      await new Promise(r => setTimeout(r, 0));
    }
    return all;
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onExport = async (format: "pdf" | "excel") => {
    setExportOpen(false);
    const date = new Date();
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    if (format === "pdf") {
      const rows = await fetchAllProperties(filters);
      const tableHtml = rows.map((p) => {
        const name = (p.name ?? "").toString().replace(/&/g,'&amp;').replace(/</g,'&lt;');
        const address = [p.street, p.city].filter(Boolean).join(", ").toString().replace(/&/g,'&amp;').replace(/</g,'&lt;');
        const price = (p.price ?? "").toString();
        const currency = (p.currency ?? "").toString();
        const year = (p.year ?? "").toString();
        const area = (p.area ?? "").toString();
        return `<tr><td>${name}</td><td>${address}</td><td>${price}</td><td>${currency}</td><td>${year}</td><td>${area}</td></tr>`;
      }).join("");
      const printHtml = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>Propiedades</title>
        <style>body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;}
        h1{font-size:18px;margin:16px 0;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;font-size:12px;} th{background:#f3f4f6;text-align:left;}
        @media print { @page { size: A4; margin: 16mm; } }
        </style></head><body>
        <h1>Listado de Propiedades</h1>
        <table><thead><tr><th>Nombre</th><th>Dirección</th><th>Precio</th><th>Moneda</th><th>Año</th><th>Área</th></tr></thead><tbody>
        ${tableHtml}
        </tbody></table>
        <script>window.onload=()=>{window.focus(); window.print();};<\/script>
        </body></html>`;
      const htmlBlob = new Blob([printHtml], { type: "text/html" });
      const blobUrl = URL.createObjectURL(htmlBlob);
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.src = blobUrl;
      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } finally {
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            iframe.remove();
          }, 1000);
        }
      };
      document.body.appendChild(iframe);
      return;
    }

    // Excel (.xlsx)
    const rows = await fetchAllProperties(filters);
    const XLSX = await import("xlsx");
    const header = ["Nombre", "Dirección", "Precio", "Moneda", "Año", "Área"];
    const data = rows.map((p) => [
      p.name ?? "",
      [p.street, p.city].filter(Boolean).join(", "),
      p.price ?? "",
      p.currency ?? "",
      p.year ?? "",
      p.area ?? "",
    ]);
    const aoa = [header, ...data];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    (ws as any)["!cols"] = [{ wch: 30 }, { wch: 40 }, { wch: 12 }, { wch: 10 }, { wch: 8 }, { wch: 8 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Propiedades");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    downloadBlob(blob, `properties_${yyyy}${mm}${dd}.xlsx`);
  };

  const goToPage = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(Math.max(1, p)));
    next.set("pageSize", String(pageSize));
    router.push(`/properties?${next.toString()}`);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                <BuildingIcon />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Propiedades</h1>
                <p className="text-gray-600">
                  {isLoading 
                    ? "Cargando..." 
                    : `${total} ${total === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  ref={exportAnchorRef}
                  onClick={() => setExportOpen((v) => !v)}
                  className="inline-flex items-center gap-2 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                  </svg>
                  Exportar
                </button>
                {exportOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
                    <button
                      onClick={() => onExport("excel")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Excel (.xlsx)
                    </button>
                    <button
                      onClick={() => onExport("pdf")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      PDF
                    </button>
                  </div>
                )}
              </div>
              <Link 
                href="/properties/new" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusIcon />
                Nueva Propiedad
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilter />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-gray-600">
              <LoaderIcon />
              <span className="text-lg font-medium">Cargando propiedades...</span>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
              <BuildingIcon />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron propiedades</h3>
            <p className="text-gray-600 mb-6">
              {params.toString() 
                ? "Intenta ajustar los filtros o agregar una nueva propiedad" 
                : "Comienza agregando tu primera propiedad al sistema"
              }
            </p>
            <Link 
              href="/properties/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200"
            >
              <PlusIcon />
              {params.toString() ? "Agregar Nueva Propiedad" : "Agregar Primera Propiedad"}
            </Link>
          </div>
        ) : (
          <>
            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {!isLoading && properties.length > 0 && (
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-200 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>

                <span className="text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                  Página {page}
                </span>

                <button 
                  onClick={() => goToPage(page + 1)} 
                  disabled={!hasNext}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-200 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                >
                  Siguiente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}


