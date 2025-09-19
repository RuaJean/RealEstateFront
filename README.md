## RealEstateFront

Aplicación Next.js para gestión de propiedades, propietarios e historial, integrada a una API externa.

### Requisitos
- Node.js 18+ (recomendado 20+)
- npm

### Setup local
1) Instalar dependencias:
```bash
npm install
```

2) Variables de entorno (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5106
```
Apunta a tu API real (Es decir la parte backend de la prueba).

3) Ejecutar en desarrollo:
```bash
npm run dev
```
Abrir `http://localhost:3000`.

### Scripts
- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run start`: iniciar build
- `npm run test`: tests unitarios (Jest)
- `npm run lint`: ESLint

### Contrato API
- Archivo: `contracts/swagger.json`
- Tipos generados: `src/models/api.ts` (via `openapi-typescript`)

### Arquitectura rápida
- Cliente HTTP: `src/services/api.ts` (Axios + interceptores; agrega Authorization desde cookie/localStorage y maneja 401)
- Tipos alias: `src/models/{Auth,Owner,Property}.ts`
- Auth: `src/hooks/useAuth.ts`, `src/store/auth.store.ts`, `src/services/auth.service.ts`
- Middleware: `src/middleware.ts` (protección de rutas y roles)
- React Query: provider `src/components/common/QueryProvider.tsx`

### Funcionalidades clave y rutas
- Login/Register: `/login`, `/register`
- Propiedades: listado `/properties`, detalle `/properties/[id]`, crear `/properties/new`, editar `/properties/[id]/edit`.
- Propietarios: listado `/owners`, crear `/owners/new`, editar `/owners/[id]`.

### Componentes reutilizables
- `PropertyCard`, `PropertyFilter`, `PropertyForm`, `PropertyImageGallery`, `ImageUploader`, `PropertyTraceTable`, `PropertyTraceForm`
- `OwnerForm`, `OwnerCard`

### Pattern de ramas (sugerido)
- `main`: estable
- `feat/<nombre>`: nuevas funcionalidades
- `fix/<bug>`: correcciones
- `chore/<tarea>`: tareas de soporte (deps, tooling)

### Notas
- Asegura `NEXT_PUBLIC_API_URL` apuntando al backend correcto.
- Rutas protegidas requieren cookie `accessToken`; rutas admin requieren `role=admin`.
