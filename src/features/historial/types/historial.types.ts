/**
 * Clases de hechos que registra el historial de un empleado
 *
 * @remarks
 * `ROTACION` agrupa los cambios de cargo, área, sueldo y jornada. El resto sale
 * de lo que el backend ya audita: ingreso, contratos, familia, estado laboral,
 * asistencia y datos financieros.
 */
export type TipoEvento =
  | "INGRESO"
  | "ROTACION"
  | "CONTRATO"
  | "FAMILIA"
  | "ESTADO"
  | "ASISTENCIA"
  | "FINANCIERO";

/** Un campo que cambió: su valor de antes y el de después */
export interface CambioCampo {
  campo: string;
  antes: string | null;
  despues: string | null;
}

/** Un campo que no cambió en un evento, pero ayuda a entender su contexto */
export interface CampoSinCambio {
  campo: string;
  valor: string;
}

/** Quién hizo el cambio, tal como lo registra la auditoría */
export interface ActorEvento {
  nombre: string;
  rol: string;
}

/**
 * Un hecho del historial del empleado, ya traducido a lenguaje de negocio
 *
 * @remarks
 * Es la forma que debería entregar el backend: el título y la descripción
 * vienen escritos y los campos con su nombre en español, no el de la columna.
 */
export interface EventoHistorial {
  id: string;
  /** Fecha del hecho como YYYY-MM-DD */
  fecha: string;
  tipo: TipoEvento;
  titulo: string;
  descripcion?: string;
  cambios?: CambioCampo[];
  sinCambios?: CampoSinCambio[];
  /**
   * Hasta cuándo rigió lo que cambió este evento (YYYY-MM-DD). `null` si sigue
   * vigente; sin este campo no se muestra la duración.
   */
  vigenteHasta?: string | null;
  actor: ActorEvento;
}
