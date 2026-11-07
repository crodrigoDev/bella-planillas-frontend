import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TONE_ICON, type StatusTone } from "../feedback/statusTone.config";

// El borde por defecto (`--border`) casi no se ve sobre blanco: se usa uno más oscuro
const BORDE = "border-muted-foreground/30";

// Deshabilitado no se desvanece (shadcn baja la opacidad a la mitad y casi desaparece):
// queda gris y sin color de tono, y el tooltip dice por qué
const DESHABILITADO =
  "disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground/60";

/** Al pasar el puntero, el botón toma el fondo y el borde suaves de su tono */
const TONE_HOVER: Record<StatusTone, string> = {
  success:
    "hover:border-success-border hover:bg-success-soft hover:text-success",
  warning:
    "hover:border-warning-border hover:bg-warning-soft hover:text-warning",
  danger:
    "hover:border-destructive-border hover:bg-destructive-soft hover:text-destructive",
  info: "hover:border-info-border hover:bg-info-soft hover:text-info",
  neutral: "hover:text-foreground",
};

interface AccionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  /** Color del icono y del hover; por defecto, gris */
  tone?: StatusTone;
  /** Si se indica, el botón queda deshabilitado y el tooltip explica por qué */
  disabledReason?: string;
}

/**
 * Botón de icono con borde para una acción (editar, quitar, adjuntar...), con su nombre en un tooltip
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
    variant: "outline",
    size: "icon",
    "aria-label": label,
    className: cn(BORDE, TONE_ICON[tone], TONE_HOVER[tone], DESHABILITADO),
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
