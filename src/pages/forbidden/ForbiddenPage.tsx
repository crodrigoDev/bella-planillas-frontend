import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

/** Explica la falta de permisos sin cerrar la sesión del usuario */
export default function ForbiddenPage() {
  const { session } = useAuth();
  const rol = session?.usuario.rol;

  return (
    <section
      aria-labelledby="forbidden-title"
      className="flex min-h-[60dvh] flex-col items-center justify-center gap-6 px-6 py-12 text-center"
    >
      <div
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive"
      >
        <ShieldAlert className="size-8" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium tracking-widest text-muted-foreground">
          ERROR 403
        </p>

        <h1
          id="forbidden-title"
          className="text-3xl font-semibold tracking-tight text-foreground"
        >
          Acceso denegado
        </h1>

        <p className="mx-auto max-w-md text-balance text-muted-foreground">
          {rol ? (
            <>
              Tu rol <span className="font-medium text-foreground">{rol}</span>{" "}
              no tiene permisos para abrir esta página.
            </>
          ) : (
            "Tu usuario no tiene permisos para abrir esta página."
          )}{" "}
          Si crees que se trata de un error, comunícate con el administrador.
        </p>
      </div>

      <Link
        to={ROUTE_PATHS.dashboard}
        className={buttonVariants({ className: "h-10 gap-2 px-5" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver al dashboard
      </Link>
    </section>
  );
}
