"use client";
import { useQuery } from "@tanstack/react-query";
import { listTracesByProperty } from "@/services/trace.service";
import type { PropertyTrace } from "@/models/Property";

export default function PropertyTraceTable({ propertyId }: { propertyId: string }) {
  const { data } = useQuery<PropertyTrace[]>({ queryKey: ["traces", propertyId], queryFn: () => listTracesByProperty(propertyId) });
  const traces = data ?? [];
  if (!traces.length) return null;

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Fecha</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Descripción</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Valor</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Moneda</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {traces.map((t, index) => (
            <tr key={t.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <td className="py-3 px-4 text-gray-900 text-sm font-medium">
                {t.dateUtc ? new Date(t.dateUtc).toLocaleDateString('es-ES') : ""}
              </td>
              <td className="py-3 px-4 text-gray-700 text-sm">{t.description}</td>
              <td className="py-3 px-4 text-gray-900 text-sm font-semibold">
                {t.value?.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm uppercase font-medium">{t.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


