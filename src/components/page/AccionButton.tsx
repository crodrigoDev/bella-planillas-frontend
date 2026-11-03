import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AccionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  /** Color del icono; por defecto, el del texto */
  className?: string;
}

/**
 * Botón de icono de una acción (editar, quitar, adjuntar...), con su nombre en un tooltip
 */
export function AccionButton({
  label,
  icon: Icon,
  onClick,
  className,
}: AccionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={label}
            onClick={onClick}
            className={cn("text-muted-foreground", className)}
          />
        }
      >
        <Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
