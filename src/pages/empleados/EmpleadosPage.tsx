import { useState } from "react";
import { Check, FileUp, Plus } from "lucide-react";
import type { CambiarEstadoLaboralDto } from "@jyp/shared-contracts";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { Button } from "@/components/ui/button";
import { APP_PREVIEW_MODE } from "@/app/config/app-preview.config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import EmpleadosFilters from "@/features/empleados/components/EmpleadosFilters";
import EmpleadosTable from "@/features/empleados/components/EmpleadosTable";
import { useEmpleadosListado } from "@/features/empleados/hooks/useEmpleadosListado";
import { AREAS_MOCK, CARGOS_MOCK, JORNADAS_MOCK } from "@/features/empleados/data/empleados.mock";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CambiarEstadoLaboralDialog from "@/features/empleados/components/acciones/CambiarEstadoLaboralDialog";
import DarBajaEmpleadoDialog from "@/features/empleados/components/acciones/DarBajaEmpleadoDialog";
import { cambiarEstadoLaboralMock, desactivarEmpleadoMock } from "@/features/empleados/data/acciones-empleado.mock";
import { ESTADOS_LABORALES } from "@/features/empleados/config/empleados.config";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";
import type { EmpleadoListado } from "@/features/empleados/types/empleados.types";

type EmpleadoAction = { type: "estado" | "baja"; empleado: EmpleadoListado };

/** Compone la vista de empleados con datos locales */
export default function EmpleadosPage() {
  const { session } = useAuth();
  const listado = useEmpleadosListado();
  const [action, setAction] = useState<EmpleadoAction | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const canManage =
    APP_PREVIEW_MODE ||
    session?.usuario.rol === "ADMIN" ||
    session?.usuario.rol === "RRHH";

  const finishAction = (message: string): void => {
    listado.refresh();
    setMessage(message);
    setAction(null);
  };

  const handleState = (values: CambiarEstadoLaboralDto): void => {
    if (!action || !canManage) return;
    const empleado = cambiarEstadoLaboralMock(action.empleado.id, values);
    finishAction(`${getEmpleadoNombre(empleado)} pasó a ${ESTADOS_LABORALES[empleado.estado_laboral].label}`);
  };

  const handleDeactivate = (): void => {
    if (!action || !canManage) return;
    const empleado = desactivarEmpleadoMock(action.empleado.id);
    finishAction(`${getEmpleadoNombre(empleado)} fue dado de baja en la vista de prueba`);
  };

  return (
    <section aria-labelledby="empleados-title" className="-m-4 min-h-full space-y-6 bg-[#faf9ff] p-4 text-slate-700 dark:bg-background sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 id="empleados-title" className="text-xl font-semibold tracking-tight text-slate-950 dark:text-foreground">
            Empleados
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Administra la información y situación laboral de los colaboradores
          </p>
        </div>
        {canManage && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-9 bg-background text-xs text-slate-700"
              render={<Link to={ROUTE_PATHS.gestionPersonal.importarEmpleados} />}
            >
              <FileUp aria-hidden="true" className="size-3.5" />
              Importar empleados
            </Button>
            <Button
              className="h-9 px-4 text-xs"
              render={<Link to={ROUTE_PATHS.gestionPersonal.crearEmpleado} />}
            >
              <Plus aria-hidden="true" className="size-3.5" />
              Nuevo empleado
            </Button>
          </div>
        )}
      </div>
      {message && <Alert role="status" className="border-emerald-200 bg-emerald-50 text-emerald-700"><Check aria-hidden="true" /><AlertDescription className="text-emerald-700">{message}</AlertDescription></Alert>}
      <EmpleadosFilters
        query={listado.query}
        areas={AREAS_MOCK}
        cargos={CARGOS_MOCK}
        jornadas={JORNADAS_MOCK}
        onChange={listado.changeFilters}
        onReset={listado.resetFilters}
      />
      <EmpleadosTable
        empleados={listado.empleados}
        canManage={canManage}
        onReset={listado.resetFilters}
        onChangeState={(empleado) => { setMessage(null); setAction({ type: "estado", empleado }); }}
        onDeactivate={(empleado) => { setMessage(null); setAction({ type: "baja", empleado }); }}
      />
      {canManage && action?.type === "estado" && <CambiarEstadoLaboralDialog empleado={action.empleado} onClose={() => setAction(null)} onSubmit={handleState} />}
      {canManage && action?.type === "baja" && <DarBajaEmpleadoDialog empleado={action.empleado} onClose={() => setAction(null)} onConfirm={handleDeactivate} />}
    </section>
  );
}
