import RegisterForm from "@/components/auth/RegisterForm";

export default function Page() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Crear cuenta</h1>
        <RegisterForm />
      </div>
    </div>
  );
}


