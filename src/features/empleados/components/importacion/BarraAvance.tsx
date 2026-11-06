interface BarraAvanceProps {
  /** Porcentaje de 0 a 100 */
  value: number;
  /** Texto que leen los lectores de pantalla */
  label: string;
}

/**
 * Barra de avance simple
 */
export function BarraAvance({ value, label }: BarraAvanceProps) {
  const porcentaje = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={porcentaje}
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  );
}
