import type { DashboardRrhhResponseDto } from "@jyp/shared-contracts";
import {
  AREAS_MOCK,
  EMPLEADOS_MOCK,
} from "@/features/empleados/data/empleados.mock";
import { getSolicitudesMock } from "@/features/solicitudes/data/solicitudes.mock";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";
import type { DashboardData } from "../types/dashboard.types";

/** Combina el contrato disponible con ejemplos de los bloques de la referencia */
export function getDashboardMock(): DashboardData {
  const pendientes = getSolicitudesMock().filter(
    (item) => item.estado === "PENDIENTE" || item.estado === "EN_REVISION",
  );
  const distribucion = [42, 26, 34, 16, 10];
  const emp = EMPLEADOS_MOCK.filter((item) => item.activo);
  const resumen: DashboardRrhhResponseDto = {
    dotacion: {
      total_activos: 128,
      altas_mes: 7,
      distribucion_areas: AREAS_MOCK.map((area, index) => ({
        area_id: area.id,
        nombre: area.nombre,
        total_empleados: distribucion[index],
      })),
    },
    contratos_alertas: {
      total_por_vencer_30d: 3,
      criticos_15d: 2,
      preventivos_30d: 1,
      proximos_a_vencer: emp
        .slice(0, 3)
        .map((item, index) => ({
          id: `c0000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
          empleado_id: item.id,
          colaborador: getEmpleadoNombre(item),
          nro_documento: item.nro_documento,
          area: item.area.nombre,
          cargo: item.cargo.nombre,
          fecha_fin: ["2026-10-20", "2026-10-26", "2026-11-05"][index],
          dias_restantes: [6, 12, 22][index],
          nivel_alerta: index < 2 ? "CRITICO" : "PREVENTIVO",
        })),
    },
    solicitudes_tramite: {
      total_pendientes: pendientes.length,
      vacaciones_pendientes: pendientes.filter(
        (item) => item.tipo === "VACACIONES",
      ).length,
      licencias_medicas_pendientes: pendientes.filter(
        (item) => item.tipo === "LICENCIA_MEDICA",
      ).length,
      permisos_pendientes: pendientes.filter((item) => item.tipo === "PERMISO")
        .length,
    },
    incidencias_mes: {
      periodo: "2026-10",
      total_faltas: 13,
      total_minutos_tardanza: 96,
      total_horas_extras_25: 18,
      total_horas_extras_35: 4,
    },
    metadata: {
      periodo_mes: "2026-10",
      fecha_corte: "2026-10-14",
      desde_cache: false,
    },
  };
  return {
    resumen,
    diseño: {
      ceses_mes: 3,
      rotacion_porcentaje: 2.4,
      asistencia: [124, 122, 120, 123, 125].map((puntual, index) => ({
        dia: ["Lun", "Mar", "Mié", "Jue", "Vie"][index],
        fecha: `2026-10-0${index + 5}`,
        puntual,
        tardanza: [3, 4, 5, 3, 2][index],
        falta: [1, 2, 3, 2, 1][index],
      })),
      cumpleaños: emp
        .slice(0, 5)
        .map((item, index) => ({
          empleado_id: item.id,
          nombre: getEmpleadoNombre(item),
          cargo: item.cargo.nombre,
          area: item.area.nombre,
          fecha: `2026-10-${[16, 19, 22, 26, 30][index]}`,
          dias: [2, 5, 8, 12, 16][index],
        })),
    },
  };
}
