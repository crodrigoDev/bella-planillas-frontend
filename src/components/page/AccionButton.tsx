import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TONE_ICON, type StatusTone } from "../feedback/statusTone.config";

interface AccionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  /** Color del icono; por defecto, gris */
  tone?: StatusTone;
}

/**
 * Botón de icono de una acción (editar, quitar, adjuntar...), con su nombre en un tooltip
 */
export function AccionButton({
  label,
  icon: Icon,
  onClick,
  tone = "neutral",
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
            className={TONE_ICON[tone]}
          />
        }
      >
        <Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
