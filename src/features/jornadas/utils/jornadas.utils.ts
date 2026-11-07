import type { CrearJornadaDto } from "@jyp/shared-contracts";

import {
  DIAS_LABORABLES_DEFECTO,
  DIAS_SEMANA,
  HORARIO_DEFECTO,
  getTurnoLabel,
} from "../config/jornadas.config";
import type {
  JornadaDatos,
  JornadaFormValues,
} from "../schemas/jornada.schema";
import type { JornadaDetalle } from "../types/jornadas.types";

/** Los datos de un día que hacen falta para calcular sus horas */
export interface DiaHorarioValores {
  laborable?: boolean;
  entrada?: string | null;
  inicio_descanso?: string | null;
  fin_descanso?: string | null;
  salida?: string | null;
}

const REGEX_HORA = /^([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/;

// Límites del motor de asistencia (`validar-jornada.ts` del backend)
const MINUTOS_DIA = 24 * 60;
const INICIO_MOTOR = 6 * 60;
const FIN_MOTOR = 22 * 60;
const REFRIGERIO_MINIMO = 45;
const DIA_MINIMO = 4 * 60;
const DIA_MAXIMO = 8 * 60;
// Por encima de las 48 h semanales ya rechaza el formulario
const MAX_MINUTOS_SEMANA_MOTOR = 48 * 60;

/**
 * Convierte una hora `HH:mm` en minutos desde la medianoche
 *
 * @returns Los minutos, o undefined si está vacía o no es una hora válida
 */
export const toMinutos = (
  hora: string | null | undefined,
): number | undefined => {
  const match = hora ? REGEX_HORA.exec(hora) : null;

  return match ? Number(match[1]) * 60 + Number(match[2]) : undefined;
};

/**
 * Minutos efectivos de un día (entrada a salida menos el refrigerio)
 *
 * @remarks
 * Misma fórmula que `calcularHorasDia` del backend: un día no laborable o sin
 * entrada o salida vale 0, una salida igual o anterior a la entrada se toma
 * como cruce de medianoche, y el refrigerio solo se resta si tiene inicio y fin.
 */
export const getMinutosDia = (dia: DiaHorarioValores): number => {
  const entrada = toMinutos(dia.entrada);
  const salida = toMinutos(dia.salida);

  if (!dia.laborable || entrada === undefined || salida === undefined) return 0;

  let total = salida - entrada;
  if (total <= 0) total += MINUTOS_DIA;

  const inicio = toMinutos(dia.inicio_descanso);
  const fin = toMinutos(dia.fin_descanso);

  if (inicio !== undefined && fin !== undefined) {
    let descanso = fin - inicio;
    if (descanso <= 0) descanso += MINUTOS_DIA;
    total -= descanso;
  }

  return Math.max(0, total);
};

/** Horas efectivas de un día, redondeadas a dos decimales como en el backend */
export const calcularHorasDia = (dia: DiaHorarioValores): number =>
  Number((getMinutosDia(dia) / 60).toFixed(2));

/** Horas efectivas de la semana: la suma de las horas de cada día */
export const calcularHorasSemana = (dias: DiaHorarioValores[]): number =>
  Number(
    dias.reduce((suma, dia) => suma + calcularHorasDia(dia), 0).toFixed(2),
  );

/** Escribe un número de horas sin ceros de sobra ("8", "7.5") */
export const formatHoras = (horas: number): string => `${Number(horas)} h`;

/** Nombre del día que ocupa esa posición del horario */
const getNombreDia = (index: number): string =>
  DIAS_SEMANA[index]?.label ?? `Día ${index + 1}`;

/** Une nombres con comas ("Lunes, Martes") */
const unir = (nombres: string[]): string => nombres.join(", ");

/**
 * Motivos por los que el motor de asistencia rechazaría esta jornada
 *
 * @param values - El turno y el horario del formulario (puede estar a medio llenar)
 * @returns Los motivos; vacío si la jornada es compatible
 *
 * @remarks
 * Replica `validar-jornada.ts` y la comprobación de turno de
 * `asignarJornadaAsistencia.useCase.ts` del backend. El motor solo calcula
 * jornadas fijas diurnas, así que una incompatible se puede guardar pero no
 * asignar a un empleado para asistencia.
 */
export const getMotivoNoCompatibleAsistencia = (values: {
  turno?: string;
  horario_semanal?: DiaHorarioValores[];
}): string[] => {
  const motivos: string[] = [];
  const horario = values.horario_semanal ?? [];

  if (values.turno === "NOCHE" || values.turno === "ROTATIVO")
    motivos.push(
      `El turno ${getTurnoLabel(values.turno)} no se calcula: solo se admiten jornadas fijas diurnas.`,
    );

  const laborables = horario.flatMap((dia, index) =>
    dia.laborable ? [{ dia, index }] : [],
  );

  if (laborables.length < 5 || laborables.length > 6)
    motivos.push(
      `Debe tener cinco o seis días laborables (ahora tiene ${laborables.length}).`,
    );

  const incompletos: string[] = [];
  const fueraDeRango: string[] = [];
  const sinRefrigerio: string[] = [];
  const duraciones: number[] = [];

  laborables.forEach(({ dia, index }) => {
    const nombre = getNombreDia(index);
    const entrada = toMinutos(dia.entrada);
    const salida = toMinutos(dia.salida);

    if (entrada === undefined || salida === undefined) {
      incompletos.push(nombre);
      return;
    }

    if (salida <= entrada || entrada < INICIO_MOTOR || salida > FIN_MOTOR) {
      fueraDeRango.push(nombre);
      return;
    }

    const inicio = toMinutos(dia.inicio_descanso);
    const fin = toMinutos(dia.fin_descanso);

    if (
      inicio === undefined ||
      fin === undefined ||
      inicio <= entrada ||
      fin >= salida ||
      fin - inicio < REFRIGERIO_MINIMO
    ) {
      sinRefrigerio.push(nombre);
      return;
    }

    duraciones.push(salida - entrada - (fin - inicio));
  });

  if (incompletos.length > 0)
    motivos.push(`Falta la entrada o la salida (${unir(incompletos)}).`);

  if (fueraDeRango.length > 0)
    motivos.push(
      `El horario debe estar entre las 06:00 y las 22:00, sin cruzar la medianoche (${unir(fueraDeRango)}).`,
    );

  if (sinRefrigerio.length > 0)
    motivos.push(
      `Falta un refrigerio de al menos 45 minutos dentro del horario (${unir(sinRefrigerio)}).`,
    );

  if (
    duraciones.some(
      (duracion) => duracion < DIA_MINIMO || duracion > DIA_MAXIMO,
    )
  )
    motivos.push("Cada día laborable debe tener entre 4 y 8 horas efectivas.");

  if (new Set(duraciones).size > 1)
    motivos.push("Todos los días laborables deben durar lo mismo.");

  // El motor compara los minutos reales con las horas guardadas (dos decimales)
  const minutosSemana = duraciones.reduce(
    (suma, duracion) => suma + duracion,
    0,
  );
  const declarados = calcularHorasSemana(horario) * 60;

  if (
    duraciones.length === laborables.length &&
    minutosSemana !== declarados &&
    minutosSemana <= MAX_MINUTOS_SEMANA_MOTOR
  )
    motivos.push(
      "El total semanal no se puede guardar exacto en horas con dos decimales: ajusta los minutos para que cada día dure un múltiplo de 3 minutos.",
    );

  return motivos;
};

/** Horario con el que arranca una jornada nueva */
export const getHorarioDefecto = (): JornadaFormValues["horario_semanal"] =>
  DIAS_SEMANA.map(({ value }) =>
    DIAS_LABORABLES_DEFECTO.includes(value)
      ? {
          dia: value,
          laborable: true,
          modalidad: "PRESENCIAL",
          ...HORARIO_DEFECTO,
        }
      : { dia: value, laborable: false, modalidad: "PRESENCIAL" },
  );

/** Valores iniciales del formulario de una jornada nueva */
export const getValoresIniciales = (): JornadaFormValues => ({
  nombre: "",
  descripcion: "",
  duracion: "TIEMPO_COMPLETO",
  turno: "MANANA",
  modalidad: "PRESENCIAL",
  tolerancia_minutos: 5,
  areas_ids: [],
  horario_semanal: getHorarioDefecto(),
  patron_rotacion: undefined,
});

/** Recorta una hora a `HH:mm`; el backend puede devolverla con segundos */
const toHoraInput = (hora: string | null | undefined): string | undefined =>
  hora ? hora.slice(0, 5) : undefined;

/**
 * Convierte la jornada del backend en los valores iniciales del formulario
 *
 * @remarks
 * Ordena el horario por día de la semana y completa los días que falten, para
 * que el formulario siempre tenga los siete.
 */
export const toFormValues = (jornada: JornadaDetalle): JornadaFormValues => ({
  nombre: jornada.nombre,
  descripcion: jornada.descripcion ?? "",
  duracion: jornada.duracion,
  turno: jornada.turno,
  modalidad: jornada.modalidad,
  tolerancia_minutos: jornada.tolerancia_minutos,
  areas_ids: jornada.jornada_areas.map(({ area }) => area.id),
  horario_semanal: DIAS_SEMANA.map(({ value }) => {
    const dia = jornada.horario_semanal.find((item) => item.dia === value);

    return {
      dia: value,
      laborable: dia?.laborable ?? false,
      modalidad: dia?.modalidad ?? "PRESENCIAL",
      entrada: toHoraInput(dia?.entrada),
      inicio_descanso: toHoraInput(dia?.inicio_descanso),
      fin_descanso: toHoraInput(dia?.fin_descanso),
      salida: toHoraInput(dia?.salida),
    };
  }),
  patron_rotacion: jornada.patron_rotacion ?? undefined,
});

/**
 * Convierte los datos validados del formulario en lo que se envía al backend
 *
 * @remarks
 * Los días no laborables van sin horas. La modalidad de cada día sigue a la
 * de la jornada, salvo en híbrido. La descripción vacía se envía como `null`
 * para que el backend la limpie. Sin turno rotativo no se envía patrón:
 * `null` en ese campo lo rechaza la base de datos, así que al cambiar de
 * rotativo a otro turno el backend conserva el patrón anterior (no se usa).
 */
export const toJornadaDto = (values: JornadaDatos): CrearJornadaDto => ({
  ...values,
  nombre: values.nombre.trim(),
  descripcion: values.descripcion?.trim() || null,
  horario_semanal: values.horario_semanal.map((dia) => {
    // Presencial o remoto fijan todos los días; solo el híbrido las mezcla
    const modalidad =
      values.modalidad === "HIBRIDO" ? dia.modalidad : values.modalidad;

    return dia.laborable
      ? { ...dia, modalidad, total_horas: calcularHorasDia(dia) }
      : { dia: dia.dia, laborable: false, modalidad, total_horas: 0 };
  }),
  patron_rotacion:
    values.turno === "ROTATIVO" ? values.patron_rotacion : undefined,
});
