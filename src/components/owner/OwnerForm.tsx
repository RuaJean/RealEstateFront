"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Owner } from "@/models/Owner";

const schema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  address: z.string().min(3, "Dirección inválida"),
  photo: z.string().url("URL inválida").or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function OwnerForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: Partial<Owner>;
  onSubmit: (values: FormValues) => void | Promise<void>;
  submitting?: boolean;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      address: defaultValues?.address ?? "",
      photo: defaultValues?.photo ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm">Nombre</label>
        <input className="border rounded p-2 w-full" {...register("name")} />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Dirección</label>
        <input className="border rounded p-2 w-full" {...register("address")} />
        {errors.address && <p className="text-red-600 text-sm">{errors.address.message}</p>}
      </div>
      <div>
        <label className="block text-sm">URL Foto (opcional)</label>
        <input className="border rounded p-2 w-full" {...register("photo")} />
        {errors.photo && <p className="text-red-600 text-sm">{errors.photo.message}</p>}
      </div>
      <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={submitting || isSubmitting}>
        {submitting || isSubmitting ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}


