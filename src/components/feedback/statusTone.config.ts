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
