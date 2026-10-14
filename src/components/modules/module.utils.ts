const labels: Record<string, string> = {
  MANANA: "Mañana",
  TARDE: "Tarde",
  NOCHE: "Noche",
  MIXTO: "Mixto",
  ROTATIVO: "Rotativo",
  TIEMPO_COMPLETO: "Tiempo completo",
  TIEMPO_PARCIAL: "Tiempo parcial",
  PRESENCIAL: "Presencial",
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
  VACACIONES: "Vacaciones",
  LICENCIA_MEDICA: "Licencia médica",
  PERMISO: "Permiso",
  JUSTIFICACION_ASISTENCIA: "Justificación de asistencia",
  ACTUALIZACION_DATOS: "Actualización de datos",
  ADELANTO_SUELDO: "Adelanto de sueldo",
  RENUNCIA: "Renuncia",
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
  ANULADA: "Anulada",
  ENTRADA: "Entrada",
  SALIDA: "Salida",
  SALIDA_ALMUERZO: "Salida a almuerzo",
  ENTRADA_ALMUERZO: "Retorno de almuerzo",
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

export function moduleLabel(value: string): string {
  return labels[value] ?? value.replaceAll("_", " ").toLowerCase();
}

export function enumItems(values: readonly string[]) {
  return values.map((value) => ({ value, label: moduleLabel(value) }));
}

/** Presenta las fechas y horas recibidas en la zona horaria de Lima */
export function moduleDate(value: string | Date | null | undefined): string {
  return value
    ? new Intl.DateTimeFormat("es-PE", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "America/Lima",
      }).format(new Date(value))
    : "Sin fecha";
}
