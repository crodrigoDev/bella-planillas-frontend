import { Badge } from "@/components/ui/badge";

/** Mantiene el mismo indicador de estado en los catalogos */
export default function RecordStatus({ active }: { active: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "bg-muted text-muted-foreground"
      }
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {active ? "Activo" : "Inactivo"}
    </Badge>
  );
}
