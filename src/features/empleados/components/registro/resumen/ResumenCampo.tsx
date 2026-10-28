import { cn } from "@/lib/utils";

interface ResumenCampoProps {
  label: string;
  value: string;
  /** Clases de la cuadrícula (`sm:col-span-2`...) para ocupar más columnas */
  className?: string;
}

/**
 * Un dato del resumen: su nombre y su valor, solo para leer
 */
export function ResumenCampo({ label, value, className }: ResumenCampoProps) {
  return (
    <dl className={cn("space-y-0.5", className)}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words">{value}</dd>
    </dl>
  );
}
