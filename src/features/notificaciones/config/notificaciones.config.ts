import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "@/components/feedback/statusTone.config";
import { ROUTE_PATHS } from "@/app/routes/path";
import type { TipoNotificacion } from "../types/notificaciones.types";

/** Máximo de alertas que guarda el backend por rol; la caché no pasa de aquí */
export const MAX_NOTIFICACIONES = 50;

/** Icono y tono de cada tipo de alerta */
export const TIPO_NOTIFICACION_CONFIG: Record<
  TipoNotificacion,
  { tone: StatusTone; Icon: LucideIcon }
> = {
  INFO: { tone: "info", Icon: InfoIcon },
  WARNING: { tone: "warning", Icon: AlertTriangleIcon },
  ERROR: { tone: "danger", Icon: AlertCircleIcon },
  SUCCESS: { tone: "success", Icon: CheckCircle2Icon },
};

/**
 * Nombre legible y enlace de cada módulo de origen
 *
 * @remarks
 * `CONTRATOS` no tiene enlace: no existe un listado global de contratos.
 */
export const MODULO_NOTIFICACION_CONFIG: Record<
  string,
  { nombre: string; ruta?: string }
> = {
  SOLICITUDES: {
    nombre: "Solicitudes",
    ruta: ROUTE_PATHS.gestionPersonal.solicitudes,
  },
  ASISTENCIA: {
    nombre: "Asistencia",
    ruta: ROUTE_PATHS.asistencia.cierreMensual,
  },
  CONTRATOS: { nombre: "Contratos" },
};
