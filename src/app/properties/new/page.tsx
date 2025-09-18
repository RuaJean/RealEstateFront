"use client";
import { useState } from "react";
import PropertyForm from "@/components/property/PropertyForm";
import { createProperty } from "@/services/property.service";
import type { PropertyCreate } from "@/models/Property";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const created = await createProperty(values as PropertyCreate);
      if (created?.id) {
        router.push(`/properties/${created.id}/edit`);
      } else {
        router.push("/properties");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Nueva propiedad</h1>
      <PropertyForm onSubmit={onSubmit} submitting={submitting} />
    </main>
  );
}


