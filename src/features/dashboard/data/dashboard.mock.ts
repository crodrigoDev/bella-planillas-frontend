import type { DashboardData } from "../types/dashboard.types";

// Datos fijos para presentar el diseño sin depender del backend
export const DASHBOARD_MOCK: DashboardData = {
  resumen: {
    dotacion: {
      total_activos: 128,
      altas_mes: 7,
      distribucion_areas: [
        {
          area_id: "10000000-0000-4000-8000-000000000001",
          nombre: "Operaciones y Logística",
          total_empleados: 42,
        },
        {
          area_id: "10000000-0000-4000-8000-000000000003",
          nombre: "Tecnología y Desarrollo",
          total_empleados: 34,
        },
        {
          area_id: "10000000-0000-4000-8000-000000000002",
          nombre: "Ventas y Comercial",
          total_empleados: 26,
        },
        {
          area_id: "10000000-0000-4000-8000-000000000004",
          nombre: "Administración y Finanzas",
          total_empleados: 16,
        },
        {
          area_id: "10000000-0000-4000-8000-000000000005",
          nombre: "Recursos Humanos",
          total_empleados: 10,
        },
      ],
    },
    contratos_alertas: {
      total_por_vencer_30d: 0,
      criticos_15d: 0,
      preventivos_30d: 0,
      proximos_a_vencer: [],
    },
    solicitudes_tramite: {
      total_pendientes: 4,
      vacaciones_pendientes: 1,
      licencias_medicas_pendientes: 1,
      permisos_pendientes: 1,
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
  },
  diseño: {
    ceses_mes: 3,
    rotacion_porcentaje: 2.4,
    asistencia: [
      { dia: "Lun", fecha: "2026-10-05", puntual: 124, tardanza: 3, falta: 1 },
      { dia: "Mar", fecha: "2026-10-06", puntual: 122, tardanza: 4, falta: 2 },
      { dia: "Mié", fecha: "2026-10-07", puntual: 120, tardanza: 5, falta: 3 },
      { dia: "Jue", fecha: "2026-10-08", puntual: 123, tardanza: 3, falta: 2 },
      { dia: "Vie", fecha: "2026-10-09", puntual: 125, tardanza: 2, falta: 1 },
    ],
    cumpleaños: [
      {
        empleado_id: "00000000-0000-4000-8000-000000000008",
        nombre: "Luis Alberto Aguilar Ramos",
        cargo: "Ingeniero de software",
        area: "Tecnología y Desarrollo",
        fecha: "2026-10-16",
        dias: 2,
      },
      {
        empleado_id: "00000000-0000-4000-8000-000000000009",
        nombre: "Camila Alvarado Pérez",
        cargo: "Analista contable",
        area: "Administración y Finanzas",
        fecha: "2026-10-19",
        dias: 5,
      },
      {
        empleado_id: "00000000-0000-4000-8000-000000000005",
        nombre: "Roberto Carlos Benavides",
        cargo: "Especialista de RRHH",
        area: "Recursos Humanos",
        fecha: "2026-10-22",
        dias: 8,
      },
      {
        empleado_id: "00000000-0000-4000-8000-000000000010",
        nombre: "Diego Castro Mendoza",
        cargo: "Especialista de RRHH",
        area: "Recursos Humanos",
        fecha: "2026-10-26",
        dias: 12,
      },
      {
        empleado_id: "00000000-0000-4000-8000-000000000011",
        nombre: "Andrea Delgado Torres",
        cargo: "Supervisor de almacén",
        area: "Operaciones y Logística",
        fecha: "2026-10-30",
        dias: 16,
      },
    ],
  },
};
