import { cn } from "@/lib/utils";

interface ResumenCifraProps {
  label: string;
  value: string | number;
  /** Color del valor, por ejemplo `text-success` o `text-destructive` */
  className?: string;
}

/**
 * Tarjeta con una cifra grande y su nombre, para los resúmenes de las importaciones
 */
export function ResumenCifra({ label, value, className }: ResumenCifraProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-semibold", className)}>{value}</p>
    </div>
  );
}
