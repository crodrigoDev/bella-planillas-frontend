import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import type { EditarEmpleadoDto } from "@jyp/shared-contracts";
import { ROUTE_PATHS } from "@/app/routes/path";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import EditarEmpleadoForm from "@/features/empleados/components/editar/EditarEmpleadoForm";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { editarEmpleadoMock } from "@/features/empleados/data/acciones-empleado.mock";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";
import type { EmpleadoMock } from "@/features/empleados/types/empleados.types";

/** Abre un empleado de prueba y permite actualizar sus datos */
export default function EditarEmpleadoPage() {
  const { empleadoId } = useParams();
  const empleado = EMPLEADOS_MOCK.find((item) => item.id === empleadoId);
  const [saved, setSaved] = useState<EmpleadoMock | null>(null);
  const available = empleado?.activo && !empleado.deleted_at;
  const currentEmpleado = saved?.id === empleadoId ? saved : empleado;

  const handleEdit = (values: EditarEmpleadoDto): void => {
    if (!empleado) return;
    setSaved(editarEmpleadoMock(empleado.id, values));
  };

  return (
    <section
      className="-m-4 min-h-full bg-[#faf9ff] p-4 dark:bg-background sm:p-6 lg:p-8"
      aria-labelledby="editar-empleado-title"
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          to={ROUTE_PATHS.gestionPersonal.empleados}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Volver a
          empleados
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1
              id="editar-empleado-title"
              className="text-xl font-semibold text-foreground"
            >
              Editar empleado
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {currentEmpleado
                ? `${getEmpleadoNombre(currentEmpleado)} · ${currentEmpleado.nro_documento}`
                : "Registro no encontrado"}
            </p>
          </div>
        </div>
        {!available ? (
          <Alert>
            <AlertTitle>No se puede editar este empleado</AlertTitle>
            <AlertDescription>
              El registro no existe o ya fue dado de baja
            </AlertDescription>
          </Alert>
        ) : saved && saved.id === empleadoId ? (
          <Card className="py-8 shadow-none ring-border">
            <CardContent className="space-y-5 text-center">
              <Check
                aria-hidden="true"
                className="mx-auto size-10 text-emerald-600"
              />
              <div role="status" className="space-y-2">
                <h2 className="text-lg font-semibold">
                  Cambios guardados en la vista de prueba
                </h2>
                <p className="text-sm text-muted-foreground">
                  {getEmpleadoNombre(saved)} · Estado laboral: Activo
                </p>
              </div>
              <Button
                render={
                  <Link
                    to={`${ROUTE_PATHS.gestionPersonal.empleados}?search=${encodeURIComponent(saved.nro_documento)}`}
                  />
                }
              >
                Ver en el listado
              </Button>
            </CardContent>
          </Card>
        ) : (
          <EditarEmpleadoForm
            key={empleado.id}
            empleado={empleado}
            onSubmit={handleEdit}
          />
        )}
      </div>
    </section>
  );
}
