import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
              RE
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              RealEstate
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Únete a nosotros</h1>
          <p className="text-gray-600">Crea tu cuenta y comienza a gestionar propiedades</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Crear Cuenta</h2>
            <p className="text-sm text-gray-600">Completa el formulario para comenzar</p>
          </div>
          
          <RegisterForm />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link 
                href="/login" 
                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 RealEstate. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}


