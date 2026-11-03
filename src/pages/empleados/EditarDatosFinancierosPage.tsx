import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  ROUTE_PATHS,
  buildEditarEmpleadoPath,
  buildEmpleadoPath,
} from "@/app/routes/path";
import { DetalleTabEstado } from "@/components/feedback/DetalleTabEstado";
import { PageHeader } from "@/components/page/PageHeader";
import { DatosFinancierosFichaForm } from "@/features/datosFinancieros/components/DatosFinancierosFichaForm";
import { useDatosFinancierosEmpleado } from "@/features/datosFinancieros/hooks/useDatosFinancieros";
import { EmpleadoCargaEstado } from "@/features/empleados/components/detalle/EmpleadoCargaEstado";
import { useEmpleado } from "@/features/empleados/hooks/useEmpleado";
import { getNombreCompleto } from "@/features/empleados/utils/empleados.utils";

/**
 * Registro o edición de los datos financieros de un empleado
 *
 * @remarks
 * Si el empleado ya tiene datos se editan (con confirmación de contraseña);
 * si no, se registran por primera vez.
 */
export default function EditarDatosFinancierosPage() {
  const { id } = useParams();
  const {
    data: empleado,
    isLoading,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useEmpleado(id);
  const datos = useDatosFinancierosEmpleado(id ?? "");

  return (
    <section
      aria-labelledby="editar-datos-financieros-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <Link
        to={id ? buildEmpleadoPath(id) : ROUTE_PATHS.gestionPersonal.empleados}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Volver a la ficha
      </Link>

      {/* El dato provisional del listado no trae la fecha de filiación: se espera el detalle */}
      <EmpleadoCargaEstado
        isLoading={isLoading || isPlaceholderData}
        error={isError ? error : null}
        onRetry={refetch}
        empleado={empleado}
        titleId="editar-datos-financieros-title"
      >
        {(empleado) => (
          <>
            <PageHeader
              id="editar-datos-financieros-title"
              title={
                datos.data ? "Editar datos financieros" : "Registrar datos financieros"
              }
              description={`Previsión social, sueldo, cuentas y salud de ${getNombreCompleto(empleado)}.`}
            />
            <DetalleTabEstado
              isLoading={datos.isLoading}
              error={datos.error}
              onRetry={() => datos.refetch()}
              isEmpty={false}
              emptyTitle=""
              emptyDescription=""
            >
              {datos.data !== undefined && (
                <DatosFinancierosFichaForm
                  empleadoId={empleado.id}
                  datos={datos.data}
                  fichaPath={buildEmpleadoPath(empleado.id)}
                  editarEmpleadoPath={buildEditarEmpleadoPath(empleado.id)}
                  tieneFiliacionAfp={Boolean(empleado.afp_fecha_filiacion)}
                />
              )}
            </DetalleTabEstado>
          </>
        )}
      </EmpleadoCargaEstado>
    </section>
  );
}
