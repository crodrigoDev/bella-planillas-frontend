import { CornerDownRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ContratoProrrogaProps {
  className?: string;
}

/**
 * Aviso de que un contrato es la renovación de otro anterior
 *
 * @remarks
 * Lo usan la ficha (`ContratoItem`) y el listado global.
 */
export function ContratoProrroga({ className }: ContratoProrrogaProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground",
        className,
      )}
    >
      <CornerDownRightIcon className="size-4 shrink-0" aria-hidden />
      Renovación del contrato anterior
    </span>
  );
}
