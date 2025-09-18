"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export default function PropertyFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const text = params.get("text") ?? "";
  const priceMin = params.get("priceMin") ?? "";
  const priceMax = params.get("priceMax") ?? "";
  const page = params.get("page") ?? "1";
  const pageSize = params.get("pageSize") ?? "10";

  const onChange = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    if (["text", "priceMin", "priceMax"].includes(key)) {
      // al cambiar filtros, reseteamos a la primera página
      next.set("page", "1");
    }
    router.push(`/properties?${next.toString()}`);
  }, [params, router]);

  const fields = useMemo(() => ({ text, priceMin, priceMax, page, pageSize }), [text, priceMin, priceMax, page, pageSize]);

  return (
    <div className="flex flex-wrap items-end gap-3 mb-4">
      <div>
        <label className="block text-sm">Texto</label>
        <input className="border rounded p-2" value={fields.text} onChange={(e) => onChange("text", e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Precio min</label>
        <input className="border rounded p-2" type="number" value={fields.priceMin} onChange={(e) => onChange("priceMin", e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Precio max</label>
        <input className="border rounded p-2" type="number" value={fields.priceMax} onChange={(e) => onChange("priceMax", e.target.value)} />
      </div>
    </div>
  );
}


