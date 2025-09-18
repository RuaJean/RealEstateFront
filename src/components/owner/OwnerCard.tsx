"use client";
import { useEffect, useState } from "react";
import type { Owner } from "@/models/Owner";
import { getOwnerById } from "@/services/owner.service";
import Link from "next/link";

export default function OwnerCard({ ownerId }: { ownerId: string }) {
  const [owner, setOwner] = useState<Owner | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!ownerId) return;
      const data = await getOwnerById(ownerId);
      if (mounted) setOwner(data);
    })();
    return () => { mounted = false; };
  }, [ownerId]);

  if (!owner) return null;

  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold">Propietario</h3>
      <p className="text-sm">{owner.name}</p>
      <p className="text-sm text-neutral-700">{owner.address}</p>
      <Link href={`/owners/${owner.id}`} className="text-blue-600 text-sm underline mt-2 inline-block">
        Ver propietario
      </Link>
    </div>
  );
}


