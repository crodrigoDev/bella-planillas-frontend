import type { DashboardRrhhResponseDto } from "@jyp/shared-contracts";

// Estos bloques pertenecen a la referencia visual y aun no estan en el DTO del dashboard
export interface DashboardDesignMock {
  ceses_mes: number;
  rotacion_porcentaje: number;
  asistencia: {
    dia: string;
    fecha: string;
    puntual: number;
    tardanza: number;
    falta: number;
  }[];
  cumpleaños: {
    empleado_id: string;
    nombre: string;
    cargo: string;
    area: string;
    fecha: string;
    dias: number;
  }[];
}

export interface DashboardData {
  resumen: DashboardRrhhResponseDto;
  diseño: DashboardDesignMock;
}
