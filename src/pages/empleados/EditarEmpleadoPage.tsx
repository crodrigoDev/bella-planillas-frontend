import { useParams } from "react-router-dom";

import { ROUTE_PATHS, buildEmpleadoPath } from "@/app/routes/path";
import { BackLink } from "@/components/page/BackLink";
import { PageHeader } from "@/components/page/PageHeader";
import { EmpleadoCargaEstado } from "@/features/empleados/components/detalle/EmpleadoCargaEstado";
import { EditarEmpleadoForm } from "@/features/empleados/components/edicion/EditarEmpleadoForm";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";
import { getNombreCompleto } from "@/features/empleados/utils/empleados.utils";

/**
 * Edición de los datos de un empleado
 */
export default function EditarEmpleadoPage() {
  const { id } = useParams();
  const {
    data: empleado,
    isLoading,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useEmpleado(id);

  return (
    <section
      aria-labelledby="editar-empleado-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <BackLink to={id ? buildEmpleadoPath(id) : ROUTE_PATHS.gestionPersonal.empleados}>Volver a la ficha</BackLink>

      {/* El dato provisional del listado no trae domicilio ni nombres separados: se espera el detalle */}
      <EmpleadoCargaEstado
        isLoading={isLoading || isPlaceholderData}
        error={isError ? error : null}
        onRetry={refetch}
        empleado={empleado}
        titleId="editar-empleado-title"
      >
        {(empleado) => (
          <>
            <PageHeader
              id="editar-empleado-title"
              title="Editar empleado"
              description={`Actualiza los datos de ${getNombreCompleto(empleado)}. Los contratos, derechohabientes y datos financieros se editan desde su ficha.`}
            />
            <EditarEmpleadoForm empleado={empleado} />
          </>
        )}
      </EmpleadoCargaEstado>
    </section>
  );
}
