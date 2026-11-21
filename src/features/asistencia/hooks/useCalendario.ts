import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { calendarioService } from "../services/calendario.service";
import type {
  AccionDiaCalendario,
  GuardarDiaCalendarioVars,
} from "../types/calendario.types";
import { asistenciaKey } from "./useAsistencia";

/**
 * Claves de caché del calendario
 *
 * @remarks
 * Cuelgan de `asistenciaKey.all`: el calendario cambia los resúmenes de todos
 * los colaboradores, así que cualquier cambio refresca también la asistencia.
 */
export const calendarioKey = {
  all: [...asistenciaKey.all, "calendario"] as const,
  anio: (anio: number) => [...asistenciaKey.all, "calendario", anio] as const,
};

/**
 * Obtiene el calendario de un año
 *
 * @remarks
 * Mantiene el año anterior visible mientras llega el nuevo.
 */
export function useCalendario(anio: number) {
  return useQuery({
    queryKey: calendarioKey.anio(anio),
    queryFn: () => calendarioService.listar(anio),
    placeholderData: keepPreviousData,
  });
}

/** Aviso de cada acción sobre un día acordado */
const MENSAJES: Record<AccionDiaCalendario, string> = {
  CREAR: "El día se agregó al calendario.",
  EDITAR: "El día se actualizó correctamente.",
  ACTIVAR: "El día se activó de nuevo.",
  DESACTIVAR: "El día se desactivó.",
};

/**
 * Guarda un día acordado, avisa y refresca la asistencia
 *
 * @remarks
 * El mismo endpoint sirve para crear, editar y cambiar el estado. Se invalida
 * toda la asistencia porque los resúmenes de todos los colaboradores cambian.
 */
export function useGuardarDiaCalendario() {
  return useMutationConAviso({
    mutationFn: ({ dto }: GuardarDiaCalendarioVars) =>
      calendarioService.guardar(dto),
    successMessage: (_, { accion }) => MENSAJES[accion],
    invalidate: [asistenciaKey.all],
  });
}
