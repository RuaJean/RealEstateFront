"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTrace } from "@/services/trace.service";
import type { PropertyTrace, PropertyTraceCreate } from "@/models/Property";

const schema = z.object({
  dateUtc: z.string().min(1),
  description: z.string().min(2),
  value: z.coerce.number().positive(),
  currency: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function PropertyTraceForm({ propertyId }: { propertyId: string }) {
  const qc = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { dateUtc: new Date().toISOString().slice(0, 10), description: "", value: 0, currency: "USD" } as any,
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: PropertyTraceCreate = {
        propertyId,
        dateUtc: new Date(values.dateUtc).toISOString(),
        description: values.description,
        value: values.value,
        currency: values.currency,
      } as any;
      return createTrace(payload);
    },
    onMutate: async (values) => {
      const key = ["traces", propertyId];
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<PropertyTrace[]>(key) || [];
      const optimistic: PropertyTrace = {
        id: `optimistic-${Date.now()}`,
        propertyId,
        dateUtc: new Date(values.dateUtc).toISOString(),
        description: values.description,
        value: values.value,
        currency: values.currency,
      } as any;
      qc.setQueryData<PropertyTrace[]>(key, [optimistic, ...previous]);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      const key = ["traces", propertyId];
      if (ctx?.previous) qc.setQueryData<PropertyTrace[]>(key, ctx.previous);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["traces", propertyId] });
      reset();
    },
  });

  const onSubmit = (values: FormValues) => mutation.mutateAsync(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <div>
        <label className="block text-sm">Fecha</label>
        <input type="date" className="border rounded p-2 w-full" {...register("dateUtc")} />
        {errors.dateUtc && <p className="text-red-600 text-sm">{errors.dateUtc.message}</p>}
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm">Descripción</label>
        <input className="border rounded p-2 w-full" {...register("description")} />
        {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Valor</label>
        <input type="number" className="border rounded p-2 w-full" {...register("value", { valueAsNumber: true })} />
        {errors.value && <p className="text-red-600 text-sm">{errors.value.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Moneda</label>
        <input className="border rounded p-2 w-full" {...register("currency")} />
        {errors.currency && <p className="text-red-600 text-sm">{errors.currency.message}</p>}
      </div>
      <div className="md:col-span-4">
        <button className="bg-black text-white px-4 py-2 rounded" disabled={isSubmitting || mutation.isPending}>
          {isSubmitting || mutation.isPending ? "Agregando..." : "Agregar traza"}
        </button>
      </div>
    </form>
  );
}


