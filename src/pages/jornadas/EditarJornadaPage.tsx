import { useParams } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { BackLink } from "@/components/page/BackLink";
import { PageHeader } from "@/components/page/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmpleadosCatalogos } from "@/features/empleados/hooks/useCatalogos";
import { JornadaForm } from "@/features/jornadas/components/formulario/JornadaForm";
import { useJornada } from "@/features/jornadas/hooks/useJornadas";

/**
 * Edición de una jornada
 *
 * @remarks
 * El formulario se monta cuando la jornada ya cargó, para que arranque con sus
 * valores. Tiene la `key` de la jornada para empezar de cero si cambia el id.
 */
export default function EditarJornadaPage() {
  const { id } = useParams();
  const { areas } = useEmpleadosCatalogos();
  const { data: jornada, isLoading, isError, error, refetch } = useJornada(id);

  return (
    <section
      aria-labelledby="editar-jornada-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <BackLink to={ROUTE_PATHS.asistencia.jornadas}>
        Volver a Jornadas
      </BackLink>

      {isLoading ? (
        <div className="space-y-6" aria-busy>
          <Skeleton className="h-14 w-80" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError ? (
        <ErrorAlert
          error={error}
          title="No se pudo cargar la jornada"
          onRetry={() => refetch()}
        />
      ) : !jornada ? (
        <div className="space-y-1 py-12 text-center">
          <h1 id="editar-jornada-title" className="text-xl font-semibold">
            No se encontró la jornada
          </h1>
          <p className="text-sm text-muted-foreground">
            Puede que ya no exista, que se haya desactivado o que el enlace no
            sea correcto.
          </p>
        </div>
      ) : (
        <>
          <PageHeader
            id="editar-jornada-title"
            title="Editar jornada"
            description={`Actualiza el horario y las áreas de ${jornada.nombre}.`}
          />
          <JornadaForm
            key={jornada.id}
            jornada={jornada}
            areas={areas.data}
            areasLoading={areas.isLoading}
          />
        </>
      )}
    </section>
  );
}
