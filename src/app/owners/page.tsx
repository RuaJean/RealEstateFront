"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useOwners } from "@/hooks/useOwners";
import { deleteOwner } from "@/services/owner.service";
import { listOwners } from "@/services/owner.service";
import { useEffect, useRef, useState } from "react";
import type { Owner } from "@/models/Owner";

// Iconos SVG
const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const page = params.get("page") ? Number(params.get("page")) : 1;
  const pageSize = params.get("pageSize") ? Number(params.get("pageSize")) : 10;
  const name = params.get("name") ?? undefined;

  const { owners, isLoading, hasNext, refetch } = useOwners({ name, page, pageSize });

  // Estado para barra de búsqueda con debounce
  const [search, setSearch] = useState<string>(name ?? "");
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setSearch(name ?? "");
  }, [name]);

  const onDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("¿Estás seguro de que quieres eliminar este propietario?")) return;
    try { 
      await deleteOwner(id); 
    } catch (error) {
      alert("Error al eliminar el propietario");
    } finally { 
      await refetch(); 
    }
  };

  const goToPage = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(Math.max(1, p)));
    next.set("pageSize", String(pageSize));
    router.push(`/owners?${next.toString()}`);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value.trim() === "") next.delete("name"); else next.set("name", value.trim());
      next.set("page", "1");
      next.set("pageSize", String(pageSize));
      router.replace(`/owners?${next.toString()}`);
    }, 300);
  };

  // Exportación
  const [exportOpen, setExportOpen] = useState(false);
  const exportAnchorRef = useRef<HTMLButtonElement | null>(null);

  const fetchAllOwners = async (filterName?: string): Promise<Array<{ name?: string; address?: string }>> => {
    const take = 200;
    let skip = 0;
    const all: Array<{ name?: string; address?: string }> = [];
    while (true) {
      const batch = await listOwners({ name: filterName, skip, take });
      all.push(...batch.map((o: Owner) => ({ name: o.name ?? "", address: (o as any).address ?? "" })));
      if (!batch || batch.length < take) break;
      skip += take;
      // Evitar bloquear UI
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
      // Generar en iframe oculto para evitar popups y ventanas en blanco
      const rows = await fetchAllOwners(name);
      const tableHtml = rows.map(r => `<tr><td>${(r.name ?? "").toString().replace(/&/g,'&amp;').replace(/</g,'&lt;')}</td><td>${(r.address ?? "").toString().replace(/&/g,'&amp;').replace(/</g,'&lt;')}</td></tr>`).join("");
      const printHtml = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>Propietarios</title>
        <style>body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;}
        h1{font-size:18px;margin:16px 0;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;font-size:12px;} th{background:#f3f4f6;text-align:left;}
        @media print { @page { size: A4; margin: 16mm; } }
        </style></head><body>
        <h1>Listado de Propietarios</h1>
        <table><thead><tr><th>Nombre</th><th>Dirección</th></tr></thead><tbody>
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

    // Excel (.xlsx real)
    const rows = await fetchAllOwners(name);
    const XLSX = await import("xlsx");
    const header = ["Nombre", "Dirección"];
    const data = rows.map(r => [r.name ?? "", r.address ?? ""]);
    const aoa = [header, ...data];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    // Establecer anchos de columna básicos
    (ws as any)["!cols"] = [{ wch: 30 }, { wch: 50 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Propietarios");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    downloadBlob(blob, `owners_${yyyy}${mm}${dd}.xlsx`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white">
                <UsersIcon />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Propietarios</h1>
                <p className="text-gray-600">Gestiona todos los propietarios de tu sistema inmobiliario</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                />
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
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
                href="/owners/new" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusIcon />
                Nuevo Propietario
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex items-center gap-3 text-gray-600">
                <LoaderIcon />
                <span className="font-medium">Cargando propietarios...</span>
              </div>
            </div>
          ) : owners.length === 0 ? (
            <div className="text-center p-12">
              <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                <UsersIcon />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay propietarios</h3>
              <p className="text-gray-600 mb-4">Comienza agregando tu primer propietario al sistema</p>
              <Link 
                href="/owners/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200"
              >
                <PlusIcon />
                Agregar Primer Propietario
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Propietario</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Dirección</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {owners.map((owner: Owner, index: number) => (
                      <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {owner.name?.charAt(0)?.toUpperCase() || "P"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{owner.name}</p>
                              <p className="text-sm text-gray-500">Propietario #{index + 1}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <LocationIcon />
                            <span>{owner.address || "Sin dirección"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Link 
                              href={`/owners/${owner.id}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                            >
                              <EditIcon />
                              Editar
                            </Link>
                            <button 
                              onClick={() => onDelete(owner.id)}
                              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                            >
                              <TrashIcon />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-4">
                {owners.map((owner: Owner, index: number) => (
                  <div key={owner.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {owner.name?.charAt(0)?.toUpperCase() || "P"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{owner.name}</h3>
                        <p className="text-sm text-gray-500">Propietario #{index + 1}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <LocationIcon />
                      <span className="text-sm">{owner.address || "Sin dirección"}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        href={`/owners/${owner.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all duration-200"
                      >
                        <EditIcon />
                        Editar
                      </Link>
                      <button 
                        onClick={() => onDelete(owner.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-all duration-200"
                      >
                        <TrashIcon />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && owners.length > 0 && (
          <div className="flex items-center justify-between mt-6">
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
      </div>
    </main>
  );
}


