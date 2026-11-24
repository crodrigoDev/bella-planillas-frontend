import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ESTADO_CORREO_RESUMEN } from "../../config/exportaciones.config";
import type { CorreoExportacion } from "../../types/exportaciones.types";
import { contarCorreosPorEstado } from "../../utils/exportaciones.utils";

interface ExportacionCorreosResumenProps {
  correos: readonly CorreoExportacion[];
}

/**
 * Resume la cantidad de boletas por estado de envío por correo
 */
export function ExportacionCorreosResumen({
  correos,
}: ExportacionCorreosResumenProps) {
  const resumen = contarCorreosPorEstado(correos);

  if (resumen.length === 0) return null;

  return (
    <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
      <p className="text-sm font-medium text-foreground">
        Envío de boletas por correo
      </p>
      <div className="flex flex-wrap gap-2">
        {resumen.map((item) => (
          <StatusBadge
            key={item.estado}
            tone={ESTADO_CORREO_RESUMEN[item.estado].tone}
            withDot
          >
            {item.textoResumen}
          </StatusBadge>
        ))}
      </div>
    </div>
  );
}
