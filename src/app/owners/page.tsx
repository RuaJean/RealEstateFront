"use client";
import { useEffect, useState } from "react";
import { listOwners, deleteOwner } from "@/services/owner.service";
import type { Owner } from "@/models/Owner";
import Link from "next/link";

export default function Page() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listOwners();
      setOwners(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("¿Eliminar propietario?")) return;
    await deleteOwner(id);
    await load();
  };

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Propietarios</h1>
        <Link href="/owners/new" className="bg-black text-white px-3 py-2 rounded">Nuevo</Link>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-neutral-100">
            <tr>
              <th className="text-left p-2 border">Nombre</th>
              <th className="text-left p-2 border">Dirección</th>
              <th className="text-left p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((o) => (
              <tr key={o.id}>
                <td className="p-2 border">{o.name}</td>
                <td className="p-2 border">{o.address}</td>
                <td className="p-2 border space-x-2">
                  <>
                    <Link className="underline" href={`/owners/${o.id}`}>Editar</Link>
                    <button className="text-red-600" onClick={() => onDelete(o.id)}>Eliminar</button>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}


