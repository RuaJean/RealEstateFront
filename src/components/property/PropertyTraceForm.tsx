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
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
              {...register("dateUtc")} 
            />
            {errors.dateUtc && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.dateUtc.message}
            </p>}
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del evento</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
              placeholder="Ej: Venta, mejora, mantenimiento..."
              {...register("description")} 
            />
            {errors.description && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.description.message}
            </p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
              placeholder="0"
              {...register("value", { valueAsNumber: true })} 
            />
            {errors.value && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.value.message}
            </p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
              {...register("currency")}
            >
              <option value="USD">USD - Dólar Americano</option>
              <option value="EUR">EUR - Euro</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="MXN">MXN - Peso Mexicano</option>
            </select>
            {errors.currency && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.currency.message}
            </p>}
          </div>
          
          <div className="sm:col-span-2">
            <button 
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting || mutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Agregando evento...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar nuevo evento
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


