import { TONE_TEXT } from "@/components/feedback/statusTone.config";
import { cn } from "@/lib/utils";
import { ALERTA_VENCIMIENTO_TONE } from "../config/contratos.config";
import type { VencimientoContrato } from "../utils/contratos.utils";

interface ContratoVencimientoProps {
  vencimiento: VencimientoContrato;
  className?: string;
}

const getDiasTexto = (dias: number): string =>
  `${dias} ${dias === 1 ? "día" : "días"}`;

/**
 * Texto con el vencimiento de un contrato vigente: "Venció hace 3 días" o "Vence en 12 días"
 *
 * @remarks
 * El color sigue la alerta del backend. Lo usan la ficha (`ContratoItem`) y el
 * listado global.
 */
export function ContratoVencimiento({
  vencimiento,
  className,
}: ContratoVencimientoProps) {
  if (vencimiento.tipo === "vencido")
    return (
      <p className={cn("text-sm", TONE_TEXT.danger, className)}>
        Venció hace {getDiasTexto(vencimiento.dias)}
      </p>
    );

  return (
    <p
      className={cn(
        "text-sm",
        vencimiento.alerta
          ? TONE_TEXT[ALERTA_VENCIMIENTO_TONE[vencimiento.alerta]]
          : "text-muted-foreground",
        className,
      )}
    >
      Vence en {getDiasTexto(vencimiento.dias)}
    </p>
  );
}
