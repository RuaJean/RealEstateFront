"use client";
import { useEffect, useState } from "react";
import { listTracesByProperty } from "@/services/trace.service";
import type { PropertyTrace } from "@/models/Property";

export default function PropertyTraceTable({ propertyId }: { propertyId: string }) {
  const [traces, setTraces] = useState<PropertyTrace[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await listTracesByProperty(propertyId);
      if (mounted) setTraces(data);
    })();
    return () => { mounted = false; };
  }, [propertyId]);

  if (!traces.length) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-neutral-100">
          <tr>
            <th className="text-left p-2 border">Fecha</th>
            <th className="text-left p-2 border">Descripción</th>
            <th className="text-left p-2 border">Valor</th>
            <th className="text-left p-2 border">Moneda</th>
          </tr>
        </thead>
        <tbody>
          {traces.map((t) => (
            <tr key={t.id}>
              <td className="p-2 border">{t.dateUtc ? new Date(t.dateUtc).toLocaleDateString() : ""}</td>
              <td className="p-2 border">{t.description}</td>
              <td className="p-2 border">{t.value}</td>
              <td className="p-2 border">{t.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


