import { ArrowLeft, SearchX } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { buttonVariants } from "@/components/ui/button";

/**
 * Informa que la ruta no existe
 *
 * @remarks
 * Muestra la dirección solicitada y un botón hacia el dashboard.
 * Si el usuario no tiene sesión, las rutas protegidas lo llevarán al login
 */
export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-12">
      <section
        aria-labelledby="not-found-title"
        className="flex w-full max-w-md flex-col items-center gap-6 text-center"
      >
        <div
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <SearchX className="size-8" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium tracking-widest text-muted-foreground">
            ERROR 404
          </p>

          <h1
            id="not-found-title"
            className="text-3xl font-semibold tracking-tight text-foreground"
          >
            Página no encontrada
          </h1>

          <p className="text-balance text-muted-foreground">
            La dirección que ingresaste no corresponde a una página disponible
            en el sistema.
          </p>
        </div>

        {/* Ayuda a detectar errores de escritura en la URL */}
        <code className="max-w-full rounded-md bg-muted px-3 py-1.5 text-sm break-all text-muted-foreground">
          {pathname}
        </code>

        <Link
          to={ROUTE_PATHS.dashboard}
          className={buttonVariants({ className: "h-10 gap-2 px-5" })}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al dashboard
        </Link>
      </section>
    </main>
  );
}
