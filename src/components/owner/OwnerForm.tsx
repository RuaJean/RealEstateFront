"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Owner } from "@/models/Owner";
import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { uploadFile } from "@/services/file.service";
import { API_BASE_URL } from "@/services/api";

const schema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  address: z.string().min(3, "Dirección inválida"),
  photo: z
    .string()
    .regex(/^(https?:\/\/|\/).*/, "Debe ser URL (http/https) o ruta absoluta iniciando con /")
    .or(z.literal(""))
    .optional(),
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      address: defaultValues?.address ?? "",
      photo: defaultValues?.photo ?? "",
    },
  });

  const photoValue = watch("photo");

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const res = await uploadFile(file);
      const urlOrPath = res.url || res.path || "";
      setValue("photo", urlOrPath, { shouldValidate: true, shouldDirty: true });
    } catch (err: any) {
      setUploadError(err?.message ?? "Error subiendo la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" 
          placeholder="Nombre del propietario"
          {...register("name")} 
        />
        {errors.name && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.name.message}
        </p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" 
          placeholder="Dirección completa"
          {...register("address")} 
        />
        {errors.address && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.address.message}
        </p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del propietario (opcional)</label>
        <div className="space-y-3">
          <input 
            type="file" 
            accept="image/*" 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" 
            onChange={onFileChange} 
          />
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subiendo imagen...
            </div>
          )}
          {uploadError && (
            <p className="text-red-600 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {uploadError}
            </p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URL de la foto (se completa automáticamente)</label>
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" 
          placeholder="/uploads/aaaa/mm/dd/archivo.jpg" 
          {...register("photo")} 
        />
        {errors.photo && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.photo.message}
        </p>}
      </div>
      
      {photoValue && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vista previa</label>
          <div className="w-32 h-32 relative border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50">
            <Image 
              src={photoValue.startsWith("/") ? `${API_BASE_URL}${photoValue}` : photoValue} 
              alt="Vista previa del propietario" 
              fill 
              className="object-cover" 
            />
          </div>
        </div>
      )}
      
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={submitting || isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting || isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando propietario...
            </>
          ) : (
            "Guardar Propietario"
          )}
        </button>
      </div>
    </form>
  );
}


