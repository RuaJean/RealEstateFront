"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Owner } from "@/models/Owner";
import { listOwners } from "@/services/owner.service";
import type { Property } from "@/models/Property";

const schema = z.object({
  name: z.string().min(2),
  street: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  zipCode: z.string().min(2),
  price: z.coerce.number().positive(),
  currency: z.string().min(1),
  year: z.coerce.number().int().min(1900),
  area: z.coerce.number().positive(),
  ownerId: z.string().uuid(),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function PropertyForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: Partial<Property>;
  onSubmit: (values: FormValues) => void | Promise<void>;
  submitting?: boolean;
}) {
  const [owners, setOwners] = useState<Owner[]>([]);
  useEffect(() => {
    (async () => setOwners(await listOwners()))();
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      street: defaultValues?.street ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "",
      country: defaultValues?.country ?? "",
      zipCode: defaultValues?.zipCode ?? "",
      price: defaultValues?.price ?? 0,
      currency: defaultValues?.currency ?? "USD",
      year: defaultValues?.year ?? new Date().getFullYear(),
      area: defaultValues?.area ?? 0,
      ownerId: defaultValues?.ownerId ?? "",
      active: defaultValues?.active ?? true,
    } as any,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm">Nombre</label>
        <input className="border rounded p-2 w-full" {...register("name")} />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Calle</label>
        <input className="border rounded p-2 w-full" {...register("street")} />
        {errors.street && <p className="text-red-600 text-sm">{errors.street.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Ciudad</label>
        <input className="border rounded p-2 w-full" {...register("city")} />
        {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Estado</label>
        <input className="border rounded p-2 w-full" {...register("state")} />
        {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
      </div>
      <div>
        <label className="block text-sm">País</label>
        <input className="border rounded p-2 w-full" {...register("country")} />
        {errors.country && <p className="text-red-600 text-sm">{errors.country.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Código Postal</label>
        <input className="border rounded p-2 w-full" {...register("zipCode")} />
        {errors.zipCode && <p className="text-red-600 text-sm">{errors.zipCode.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Precio</label>
        <input type="number" className="border rounded p-2 w-full" {...register("price", { valueAsNumber: true })} />
        {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Moneda</label>
        <input className="border rounded p-2 w-full" {...register("currency")} />
        {errors.currency && <p className="text-red-600 text-sm">{errors.currency.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Año</label>
        <input type="number" className="border rounded p-2 w-full" {...register("year", { valueAsNumber: true })} />
        {errors.year && <p className="text-red-600 text-sm">{errors.year.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Área</label>
        <input type="number" className="border rounded p-2 w-full" {...register("area", { valueAsNumber: true })} />
        {errors.area && <p className="text-red-600 text-sm">{errors.area.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Propietario</label>
        <select className="border rounded p-2 w-full" {...register("ownerId")}> 
          <option value="">Seleccione...</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id!}>{o.name}</option>
          ))}
        </select>
        {errors.ownerId && <p className="text-red-600 text-sm">{errors.ownerId.message}</p>}
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("active")} /> Activa
        </label>
      </div>
      <div className="md:col-span-2">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={submitting || isSubmitting}>
          {submitting || isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}


