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
  /** Si se indica, el botón queda deshabilitado y el tooltip explica por qué */
  disabledReason?: string;
}

/**
 * Botón de icono de una acción (editar, quitar, adjuntar...), con su nombre en un tooltip
 *
 * @remarks
 * Deshabilitado, el tooltip se engancha a un `span` que envuelve al botón,
 * porque un botón deshabilitado no recibe el puntero.
 */
export function AccionButton({
  label,
  icon: Icon,
  onClick,
  tone = "neutral",
  disabledReason,
}: AccionButtonProps) {
  const disabled = disabledReason !== undefined;
  const buttonProps = {
    type: "button",
    variant: "ghost",
    size: "icon",
    "aria-label": label,
    className: TONE_ICON[tone],
  } as const;

  return (
    <Tooltip>
      {disabled ? (
        <TooltipTrigger render={<span className="inline-flex" />}>
          <Button {...buttonProps} disabled>
            <Icon />
          </Button>
        </TooltipTrigger>
      ) : (
        <TooltipTrigger render={<Button {...buttonProps} onClick={onClick} />}>
          <Icon />
        </TooltipTrigger>
      )}
      <TooltipContent>{disabledReason ?? label}</TooltipContent>
    </Tooltip>
  );
}
