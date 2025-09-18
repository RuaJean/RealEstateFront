"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OwnerForm from "@/components/owner/OwnerForm";
import { createOwner, getOwnerById, updateOwner } from "@/services/owner.service";
import type { Owner } from "@/models/Owner";

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === "new";
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let mounted = true;
    (async () => {
      try {
        const data = await getOwnerById(id);
        if (mounted) setOwner(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, isNew]);

  const onSubmit = async (values: { name: string; address: string; photo?: string }) => {
    setSubmitting(true);
    try {
      if (isNew) {
        await createOwner(values);
      } else if (owner?.id) {
        await updateOwner(owner.id, values);
      }
      router.push("/owners");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isNew && loading) return <main className="p-6">Cargando...</main>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{isNew ? "Nuevo propietario" : "Editar propietario"}</h1>
      <OwnerForm defaultValues={owner ?? undefined} onSubmit={onSubmit} submitting={submitting} />
    </main>
  );
}


