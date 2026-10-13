import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** Explica la falta de permisos sin cerrar la sesión del usuario */
export default function ForbiddenPage() {
  return (
    <section
      aria-labelledby="forbidden-title"
      className="mx-auto w-full max-w-lg py-12"
    >
      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-muted-foreground">403</p>
          <CardTitle>
            <h1 id="forbidden-title" className="text-2xl font-semibold">
              Acceso denegado
            </h1>
          </CardTitle>
          <CardDescription>
            Tu usuario no tiene permisos para abrir esta página.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            to={ROUTE_PATHS.dashboard}
            className="rounded-sm text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Volver al dashboard
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
