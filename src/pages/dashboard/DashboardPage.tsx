import { RefreshCw, UserMinus, UserPlus, Users } from "lucide-react";

import { ROUTE_PATHS } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { SelectorMes } from "@/components/filters/SelectorMes";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AreaDistribution } from "@/features/dashboard/components/AreaDistribution";
import { BirthdaysList } from "@/features/dashboard/components/BirthdaysList";
import { CierreAsistenciaResumen } from "@/features/dashboard/components/CierreAsistenciaResumen";
import { ContratosPorVencer } from "@/features/dashboard/components/ContratosPorVencer";
import { KpiCard } from "@/features/dashboard/components/KpiCard";
import { PendingRequests } from "@/features/dashboard/components/PendingRequests";
import { WeeklyAttendance } from "@/features/dashboard/components/WeeklyAttendance";
import { useDashboardFilters } from "@/features/dashboard/hooks/useDashboardFilters";
import { useDashboardRrhh } from "@/features/dashboard/hooks/useDashboardRrhh";
import {
  buildKpiDelta,
  formatPorcentaje,
} from "@/features/dashboard/utils/dashboard.utils";
import { getPeriodoActual } from "@/lib/periodo.utils";
import { cn } from "@/lib/utils";

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-5 w-36 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader className="border-b">
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="pt-4">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
          <CardHeader className="border-b">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-7 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="border-b">
              <Skeleton className="h-5 w-44" />
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const PERIODO_MINIMO = "1992-01";

function DashboardRrhh() {
  const { periodo, setPeriodo } = useDashboardFilters();
  const { data, isLoading, isPlaceholderData, error, refetch } =
    useDashboardRrhh(periodo);
  const periodoDatos = data?.metadata.periodo ?? periodo;
  const esMesActual = periodoDatos === getPeriodoActual();

  return (
    <section
      aria-labelledby="dashboard-title"
      className="flex flex-col space-y-6 pb-6"
    >
      <PageHeader
        id="dashboard-title"
        title="Dashboard de Recursos Humanos"
        description="Resumen de personal, asistencia y novedades del periodo"
        action={
          <SelectorMes
            periodo={periodo}
            onChange={setPeriodo}
            periodoMinimo={PERIODO_MINIMO}
          />
        }
      />

      <ErrorAlert
        error={error}
        title="No se pudo cargar el dashboard de Recursos Humanos"
        onRetry={() => refetch()}
      />

      {isLoading && <DashboardSkeleton />}

      {data && (
        <div
          aria-busy={isPlaceholderData}
          className={cn(
            "space-y-6 transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Colaboradores activos"
              value={data.dotacion.total_activos}
              delta={buildKpiDelta(
                data.dotacion.total_activos - data.dotacion.comparacion.activos,
                data.dotacion.comparacion.periodo,
                { positivoEsBueno: true },
              )}
              icon={Users}
              iconClassName="bg-primary/10 text-primary"
              linkTo={ROUTE_PATHS.gestionPersonal.empleados}
              linkLabel="Ver colaboradores"
            />
            <KpiCard
              title="Ingresos del mes"
              value={data.dotacion.altas_mes}
              delta={buildKpiDelta(
                data.dotacion.altas_mes - data.dotacion.comparacion.altas,
                data.dotacion.comparacion.periodo,
                { positivoEsBueno: true },
              )}
              icon={UserPlus}
              iconClassName="bg-success-soft text-success-soft-foreground"
            />
            <KpiCard
              title="Ceses del mes"
              value={data.dotacion.ceses_mes}
              delta={buildKpiDelta(
                data.dotacion.ceses_mes - data.dotacion.comparacion.ceses,
                data.dotacion.comparacion.periodo,
                { positivoEsBueno: false },
              )}
              icon={UserMinus}
              iconClassName="bg-warning-soft text-warning-soft-foreground"
            />
            <KpiCard
              title="Rotación"
              value={formatPorcentaje(data.dotacion.rotacion_porcentaje)}
              delta={buildKpiDelta(
                data.dotacion.comparacion.rotacion_puntos_porcentuales,
                data.dotacion.comparacion.periodo,
                { positivoEsBueno: false, sufijo: "pp", decimales: 2 },
              )}
              icon={RefreshCw}
              iconClassName="bg-info-soft text-info-soft-foreground"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <WeeklyAttendance
                asistencia={data.asistencia_semana}
                esMesActual={esMesActual}
              />
            </div>
            <div className="lg:col-span-5">
              <AreaDistribution
                areas={data.dotacion.distribucion_areas}
                totalActivos={data.dotacion.total_activos}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CierreAsistenciaResumen
              cierre={data.cierre_asistencia}
              periodo={periodoDatos}
            />
            <ContratosPorVencer
              alertas={data.contratos_alertas}
              esMesActual={esMesActual}
              fechaCorte={data.metadata.fecha_corte}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BirthdaysList
              cumpleanos={data.cumpleanos}
              periodo={periodoDatos}
              esMesActual={esMesActual}
            />
            <PendingRequests solicitudes={data.solicitudes_tramite} />
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Pantalla de inicio de la aplicación; muestra el resumen de RRHH solo para ese rol
 */
export default function DashboardPage() {
  const { session } = useAuth();

  if (session?.usuario.rol !== "RRHH") {
    return (
      <section aria-labelledby="dashboard-title" className="flex flex-col gap-6">
        <PageHeader
          id="dashboard-title"
          title="Inicio"
          description="Bienvenido al sistema de gestión de personal y planillas."
        />
      </section>
    );
  }

  return <DashboardRrhh />;
}
