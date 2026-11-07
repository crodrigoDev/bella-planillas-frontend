import type { NotificacionDto } from "@jyp/shared-contracts";

/** Alerta del historial o del tiempo real (`GET /notificaciones`) */
export type Notificacion = NotificacionDto;

/** Nivel de la alerta que define el icono y el color */
export type TipoNotificacion = Notificacion["tipo"];
