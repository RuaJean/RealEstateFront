"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterRequest } from "@/models/Auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const { register: registerFn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const payload: RegisterRequest = { email: values.email, password: values.password };
      await registerFn(payload);
      window.location.href = "/dashboard";
    } catch (e: any) {
      setError(e?.message ?? "Error registrando usuario");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" className="w-full border p-2 rounded" {...register("email")} />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Contraseña</label>
        <input type="password" className="w-full border p-2 rounded" {...register("password")} />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">
        {isSubmitting ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}

export default RegisterForm;


