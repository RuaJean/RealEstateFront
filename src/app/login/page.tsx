import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
              RE
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RealEstate
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-600">Accede a tu panel de control inmobiliario</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Iniciar Sesión</h2>
            <p className="text-sm text-gray-600">Ingresa tus credenciales para continuar</p>
          </div>
          
          <LoginForm />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link 
                href="/register" 
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Regístrate aquí
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


