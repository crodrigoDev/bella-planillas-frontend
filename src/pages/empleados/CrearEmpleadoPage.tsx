import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_PATHS } from "@/app/routes/path";
import CrearEmpleadoForm from "@/features/empleados/components/crear/CrearEmpleadoForm";
import { registrarEmpleadoCompletoMock } from "@/features/empleados/data/registro-empleado.mock";
import type { RegistroEmpleadoDto } from "@/features/empleados/types/crear-empleado.types";
import type { EmpleadoListado } from "@/features/empleados/types/empleados.types";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";

/** Muestra el registro y guarda el resultado solo en los datos de prueba */
export default function CrearEmpleadoPage() {
  const [createdEmpleado, setCreatedEmpleado] =
    useState<EmpleadoListado | null>(null);

  const handleCreate = (values: RegistroEmpleadoDto): void => {
    setCreatedEmpleado(registrarEmpleadoCompletoMock(values));
  };

  return (
    <section
      className="-m-4 min-h-full bg-[#faf9ff] p-4 dark:bg-background sm:p-6 lg:p-8"
      aria-labelledby="crear-empleado-title"
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
              id="crear-empleado-title"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Nuevo empleado
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Registra la información personal y laboral del colaborador
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Los registros de esta vista son temporales y se reinician al recargar
          la aplicación
        </p>
        {createdEmpleado ? (
          <Card className="py-8 shadow-none ring-border">
            <CardContent className="space-y-5 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check aria-hidden="true" className="size-6" />
              </span>
              <div role="status" className="space-y-2">
                <h2 className="text-lg font-semibold">
                  Empleado agregado a la vista de prueba
                </h2>
                <p className="text-sm text-muted-foreground">
                  {getEmpleadoNombre(createdEmpleado)} ·{" "}
                  {createdEmpleado.nro_documento}
                </p>
                <p className="text-xs text-muted-foreground">
                  El contrato y los datos financieros quedaron asociados al
                  empleado
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCreatedEmpleado(null)}
                >
                  <Plus aria-hidden="true" /> Registrar otro
                </Button>
                <Button
                  render={
                    <Link
                      to={`${ROUTE_PATHS.gestionPersonal.empleados}?search=${encodeURIComponent(createdEmpleado.nro_documento)}`}
                    />
                  }
                >
                  Ver en el listado
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <CrearEmpleadoForm onSubmit={handleCreate} />
        )}
      </div>
    </section>
  );
}
