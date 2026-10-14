import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTE_PATHS } from "@/app/routes/path";
import CrearJornadaForm from "@/features/jornadas/components/crear/CrearJornadaForm";

/** Presenta el registro de jornada en una pagina completa */
export default function CrearJornadaPage() {
  return (
    <section className="-m-4 min-h-full bg-[#f5f5fc] p-4 dark:bg-background sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to={ROUTE_PATHS.asistencia.jornadas}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Volver a jornadas
        </Link>
        <header className="mt-5">
          <h1 className="text-xl font-semibold">Nueva jornada</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Define una plantilla reutilizable para los empleados de las áreas
            aplicables
          </p>
        </header>
        <CrearJornadaForm />
      </div>
    </section>
  );
}
