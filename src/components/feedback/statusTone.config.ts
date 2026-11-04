/**
 * Significado de color de un estado: verde = en regla, ámbar = atención,
 * rojo = problema, azul = informativo, gris = sin color propio
 */
export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

/** Fondo, borde y texto de la insignia de cada tono (tokens de `index.css`) */
export const TONE_BADGE: Record<StatusTone, string> = {
  success: "border-success-border bg-success-soft text-success-soft-foreground",
  warning: "border-warning-border bg-warning-soft text-warning-soft-foreground",
  danger:
    "border-destructive-border bg-destructive-soft text-destructive-soft-foreground",
  info: "border-info-border bg-info-soft text-info-soft-foreground",
  neutral: "border-border bg-muted text-muted-foreground",
};

/** Color del punto de cada tono */
export const TONE_DOT: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
  neutral: "bg-muted-foreground",
};

/**
 * Color de un texto suelto de cada tono
 *
 * @remarks
 * Usa los colores de alto contraste: los sólidos (`text-success`...) no llegan a 4,5:1
 * sobre fondo claro y solo sirven para iconos y puntos.
 */
export const TONE_TEXT: Record<StatusTone, string> = {
  success: "text-success-soft-foreground",
  warning: "text-warning-soft-foreground",
  danger: "text-destructive",
  info: "text-info-soft-foreground",
  neutral: "text-muted-foreground",
};

/** Color de un icono de cada tono (los iconos piden menos contraste que el texto) */
export const TONE_ICON: Record<StatusTone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  neutral: "text-muted-foreground",
};
