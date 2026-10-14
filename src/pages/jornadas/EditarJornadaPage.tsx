import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTE_PATHS } from "@/app/routes/path";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { JORNADAS_LISTADO_MOCK } from "@/features/jornadas/data/jornadas.mock";
import JornadaForm from "@/features/jornadas/components/form/JornadaForm";

/** Carga la jornada elegida y abre los mismos pasos del registro */
export default function EditarJornadaPage() {
  const { jornadaId } = useParams();
  const jornada = JORNADAS_LISTADO_MOCK.find((item) => item.id === jornadaId);
  return (
    <section
      aria-labelledby="editar-jornada-title"
      className="-m-4 min-h-full bg-[#faf9ff] p-4 text-slate-700 dark:bg-background dark:text-foreground sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-4xl">
        <Link
          to={ROUTE_PATHS.asistencia.jornadas}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Volver a jornadas
        </Link>
        <header className="mt-5">
          <h1
            id="editar-jornada-title"
            className="text-xl font-semibold tracking-tight text-slate-950 dark:text-foreground"
          >
            Editar jornada
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
            {jornada
              ? `Actualiza los datos y el horario de ${jornada.nombre}`
              : "Registro no encontrado"}
          </p>
        </header>
        {jornada?.activo ? (
          <JornadaForm key={jornada.id} jornada={jornada} />
        ) : (
          <Alert className="mt-6">
            <AlertTitle>No se puede editar esta jornada</AlertTitle>
            <AlertDescription>
              {jornada
                ? "Reactiva la jornada desde el listado para poder editarla"
                : "La jornada no existe o ya no está disponible"}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  );
}
