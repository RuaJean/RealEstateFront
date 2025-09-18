import LoginForm from "@/components/auth/LoginForm";

export default function Page() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
        <LoginForm />
      </div>
    </div>
  );
}


