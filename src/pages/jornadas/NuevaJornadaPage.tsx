import { ROUTE_PATHS } from "@/app/routes/path";
import { BackLink } from "@/components/page/BackLink";
import { PageHeader } from "@/components/page/PageHeader";
import { useEmpleadosCatalogos } from "@/features/empleados/hooks/useCatalogos";
import { JornadaForm } from "@/features/jornadas/components/formulario/JornadaForm";

/**
 * Creación de una jornada
 */
export default function NuevaJornadaPage() {
  const { areas } = useEmpleadosCatalogos();

  return (
    <section
      aria-labelledby="nueva-jornada-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <BackLink to={ROUTE_PATHS.asistencia.jornadas}>
        Volver a Jornadas
      </BackLink>

      <PageHeader
        id="nueva-jornada-title"
        title="Nueva jornada"
        description="Define el horario de la semana y las áreas donde se podrá usar."
      />

      <JornadaForm areas={areas.data} areasLoading={areas.isLoading} />
    </section>
  );
}
