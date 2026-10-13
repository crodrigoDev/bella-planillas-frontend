import AuthBrandPanel from "@/features/auth/components/AuthBrandPanel";
import { Outlet } from "react-router-dom";

/**
 * Comparte la estructura visual de las páginas de autenticación
 *
 * @remarks
 * Muestra la marca sobre el contenido móvil y en una columna lateral
 * en escritorio.
 */
export default function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background lg:grid lg:grid-cols-2">
      <AuthBrandPanel />
      <main className="flex flex-1 items-center justify-center bg-primary/2.5 px-6 py-12 lg:p-12">
        <Outlet />
      </main>
    </div>
  );
}
