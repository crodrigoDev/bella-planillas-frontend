import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, FileText, IdCard, UserRoundSearch } from "lucide-react";
import { ROUTE_PATHS } from "@/app/routes/path";
import { APP_PREVIEW_MODE } from "@/app/config/app-preview.config";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getContratosEmpleadoMock, getMarcacionesEmpleadoMock } from "@/features/empleados/data/ficha-empleado.mock";
import { getJornadaEmpleadoMock } from "@/features/empleados/data/jornadas-empleado.mock";
import { addFichaDays, getFichaSemana } from "@/features/empleados/utils/ficha-empleado.utils";
import FichaEmpleadoHeader from "@/features/empleados/components/ficha/FichaEmpleadoHeader";
import EmpleadoInformacionTab from "@/features/empleados/components/ficha/EmpleadoInformacionTab";
import EmpleadoContratosTab from "@/features/empleados/components/ficha/EmpleadoContratosTab";
import EmpleadoAsistenciaTab from "@/features/empleados/components/ficha/EmpleadoAsistenciaTab";
import FichaEmptyState from "@/features/empleados/components/ficha/FichaEmptyState";

/** Compone las tres pestañas de la ficha con las fuentes de prueba */
export default function FichaEmpleadoPage() {
  const { empleadoId } = useParams();
  const [params, setParams] = useSearchParams();
  const { session } = useAuth();
  const empleado = EMPLEADOS_MOCK.find((item) => item.id === empleadoId);
  const tabParam = params.get("tab");
  const tab = tabParam === "contratos" || tabParam === "asistencia" ? tabParam : "informacion";
  const semana = getFichaSemana(params.get("semana"));
  const canManage = APP_PREVIEW_MODE || session?.usuario.rol === "ADMIN" || session?.usuario.rol === "RRHH";
  const contratos = empleado ? getContratosEmpleadoMock(empleado.id) : [];
  const jornada = empleado ? getJornadaEmpleadoMock(empleado.jornada_id) : null;
  const marcaciones = empleado ? getMarcacionesEmpleadoMock(empleado.id, semana, addFichaDays(semana, 6)) : [];

  const changeTab = (value: unknown): void => {
    if (value !== "informacion" && value !== "contratos" && value !== "asistencia") return;
    const next = new URLSearchParams(params);
    next.set("tab", value);
    void setParams(next, { replace: true });
  };

  const changeWeek = (value: string): void => {
    const next = new URLSearchParams(params);
    next.set("semana", value);
    void setParams(next, { replace: true });
  };

  return (
    <section aria-labelledby="ficha-empleado-title" className="-m-4 min-h-full bg-[#faf9ff] p-4 dark:bg-background sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link to={ROUTE_PATHS.gestionPersonal.empleados} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"><ArrowLeft aria-hidden="true" className="size-3.5" /> Volver a empleados</Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h1 id="ficha-empleado-title" className="text-xl font-semibold text-foreground">Ficha de empleado</h1><p className="mt-1 text-xs text-muted-foreground">Información, contratos y asistencia del colaborador</p></div>
          <Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">Vista de prueba</Badge>
        </div>
        {!empleado ? <FichaEmptyState icon={UserRoundSearch} title="Empleado no encontrado" description="El registro solicitado no existe en los datos de prueba" /> : (
          <>
            <FichaEmpleadoHeader empleado={empleado} canManage={canManage} />
            <Tabs value={tab} onValueChange={changeTab} className="gap-5">
              <TabsList variant="line" aria-label="Secciones de la ficha" className="w-full justify-start border-b p-0 group-data-horizontal/tabs:h-auto">
                <TabsTrigger value="informacion" className="h-auto flex-none px-2 py-3 text-xs after:bg-primary data-active:text-primary group-data-horizontal/tabs:after:bottom-0 sm:px-4"><IdCard aria-hidden="true" className="hidden size-3.5 sm:block" />Información</TabsTrigger>
                <TabsTrigger value="contratos" className="h-auto flex-none px-2 py-3 text-xs after:bg-primary data-active:text-primary group-data-horizontal/tabs:after:bottom-0 sm:px-4"><FileText aria-hidden="true" className="hidden size-3.5 sm:block" />Contratos</TabsTrigger>
                <TabsTrigger value="asistencia" className="h-auto flex-none px-2 py-3 text-xs after:bg-primary data-active:text-primary group-data-horizontal/tabs:after:bottom-0 sm:px-4"><CalendarDays aria-hidden="true" className="hidden size-3.5 sm:block" />Asistencia</TabsTrigger>
              </TabsList>
              <TabsContent value="informacion"><EmpleadoInformacionTab empleado={empleado} /></TabsContent>
              <TabsContent value="contratos"><EmpleadoContratosTab contratos={contratos} available={empleado.activo && !empleado.deleted_at} /></TabsContent>
              <TabsContent value="asistencia"><EmpleadoAsistenciaTab empleado={empleado} jornada={jornada} marcaciones={marcaciones} semana={semana} onWeekChange={changeWeek} /></TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </section>
  );
}
