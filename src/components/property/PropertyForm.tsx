"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Owner } from "@/models/Owner";
import type { Property } from "@/models/Property";
import { useOwners } from "@/hooks/useOwners";

const createSchema = z.object({
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

const updateSchema = z.object({
  name: z.string().min(2),
  street: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  zipCode: z.string().min(2),
  year: z.coerce.number().int().min(1900),
  area: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof createSchema>;

export default function PropertyForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: Partial<Property>;
  onSubmit: (values: any) => void | Promise<void>;
  submitting?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [accOwners, setAccOwners] = useState<Owner[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  // debounce del término de búsqueda
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  // fetch owners con paginación
  const { owners, hasNext, isLoading, isFetching } = useOwners({ name: debounced, page, pageSize: 10 });

  // acumular resultados por página; resetear al cambiar búsqueda
  useEffect(() => {
    setPage(1);
  }, [debounced]);

  useEffect(() => {
    if (page === 1) {
      setAccOwners(owners ?? []);
    } else {
      setAccOwners(prev => {
        const incoming = owners ?? [];
        const merged = [...prev];
        for (const o of incoming) {
          if (!merged.some(m => m.id === o.id)) merged.push(o);
        }
        return merged;
      });
    }
  }, [owners, page]);

  const isEdit = Boolean(defaultValues?.id);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
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

  const selectedOwnerId: string = watch("ownerId");
  useEffect(() => {
    // cuando hay owner por defecto (ediciones futuras), sincronizar nombre en input
    if (selectedOwnerId && accOwners.length > 0) {
      const s = accOwners.find(o => o.id === selectedOwnerId);
      if (s && search === "") setSearch(s?.name ?? "");
    }
  }, [selectedOwnerId, accOwners]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
          placeholder="Nombre de la propiedad"
          {...register("name")} 
        />
        {errors.name && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
{(errors.name?.message as string) || ""}
        </p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Calle</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
          placeholder="Dirección de la calle"
          {...register("street")} 
        />
        {errors.street && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
{(errors.street?.message as string) || ""}
        </p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
          placeholder="Ciudad"
          {...register("city")} 
        />
        {errors.city && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {(errors.city?.message as string) || ""}
        </p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
          placeholder="Estado o provincia"
          {...register("state")} 
        />
        {errors.state && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {(errors.state?.message as string) || ""}
        </p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
          placeholder="País"
          {...register("country")} 
        />
        {errors.country && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {(errors.country?.message as string) || ""}
        </p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
          placeholder="Código postal"
          {...register("zipCode")} 
        />
        {errors.zipCode && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {(errors.zipCode?.message as string) || ""}
        </p>}
      </div>
      {!isEdit && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
              placeholder="0"
              {...register("price", { valueAsNumber: true })} 
            />
            {errors.price && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {(errors.price?.message as string) || ""}
            </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
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
              {(errors.currency?.message as string) || ""}
            </p>}
          </div>
        </>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Año de construcción</label>
        <input 
          type="number" 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
          placeholder={new Date().getFullYear().toString()}
          {...register("year", { valueAsNumber: true })} 
        />
        {errors.year && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {(errors.year?.message as string) || ""}
        </p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Área (m²)</label>
        <input 
          type="number" 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
          placeholder="0"
          {...register("area", { valueAsNumber: true })} 
        />
        {errors.area && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {(errors.area?.message as string) || ""}
        </p>}
      </div>
      {!isEdit && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Propietario</label>
          {/* input de búsqueda visual */}
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Escribe para buscar propietario por nombre"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenDropdown(true);
            }}
            onFocus={() => setOpenDropdown(true)}
            onBlur={(e) => {
              // retraso pequeño para permitir click en opciones
              setTimeout(() => setOpenDropdown(false), 150);
            }}
            aria-autocomplete="list"
            aria-expanded={openDropdown}
            autoComplete="off"
          />
          {/* input oculto ligado al formulario */}
          <input type="hidden" {...register("ownerId")} />
          {selectedOwnerId && (
            <button
              type="button"
              className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
              onClick={() => {
                setValue("ownerId", "");
                setSearch("");
                setOpenDropdown(true);
              }}
              title="Limpiar selección"
            >
              ✕
            </button>
          )}
          {openDropdown && (
            <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto text-gray-900">
              {isLoading && accOwners.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-700">Cargando...</div>
              ) : accOwners.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-700">Sin resultados</div>
              ) : (
                <ul className="py-1 divide-y divide-gray-100">
                  {accOwners.map((o) => (
                    <li key={o.id}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setValue("ownerId", o.id!);
                          setSearch(o.name ?? "");
                          setOpenDropdown(false);
                        }}
                      >
                        {o.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {hasNext && (
                <div className="border-t border-gray-100">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                    disabled={isFetching}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {isFetching ? "Cargando..." : "Cargar más"}
                  </button>
                </div>
              )}
            </div>
          )}
          {errors.ownerId && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {(errors.ownerId?.message as string) || ""}
          </p>}
        </div>
      )}
      {!isEdit && (
        <div className="md:col-span-2 flex items-center gap-3">
          <label className="inline-flex items-center gap-3 cursor-pointer">
            {/* <input 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" 
              {...register("active")} 
            /> */}
            {/* <span className="text-sm font-medium text-gray-700">Propiedad activa</span> */}
          </label>
        </div>
      )}
      <div className="md:col-span-2">
        <button 
          type="submit" 
          disabled={submitting || isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting || isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            "Guardar Propiedad"
          )}
        </button>
      </div>
    </form>
  );
}


