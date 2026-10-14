import ModulePage from "@/components/modules/ModulePage";
import { DASHBOARD_MOCK } from "@/features/dashboard/data/dashboard.mock";
import DashboardMetrics from "@/features/dashboard/components/DashboardMetrics";
import DashboardAttendance from "@/features/dashboard/components/DashboardAttendance";
import DashboardAreas from "@/features/dashboard/components/DashboardAreas";
import DashboardBirthdays from "@/features/dashboard/components/DashboardBirthdays";
import DashboardRequests from "@/features/dashboard/components/DashboardRequests";

/** Compone el resumen de Recursos Humanos con bloques independientes */
export default function DashboardPage() {
  const data = DASHBOARD_MOCK;
  return (
    <ModulePage
      title="Dashboard de Recursos Humanos"
      description="Resumen de personal, asistencia y novedades del periodo"
    >
      <DashboardMetrics data={data} />
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <DashboardAttendance
          days={data.diseño.asistencia}
          total={data.resumen.dotacion.total_activos}
        />
        <DashboardAreas dotacion={data.resumen.dotacion} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardBirthdays items={data.diseño.cumpleaños} />
        <DashboardRequests />
      </div>
    </ModulePage>
  );
}
