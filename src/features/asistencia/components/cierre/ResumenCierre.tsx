import { TONE_TEXT } from "@/components/feedback/statusTone.config";
import { ResumenCifra } from "@/components/page/ResumenCifra";
import type { ConteoIncidencias } from "../../types/incidencias.types";

interface ResumenCierreProps {
  /** Conteo por estado; mientras llega se muestran guiones */
  conteo: ConteoIncidencias | undefined;
}

/** Cuántos resúmenes del mes están pendientes, aprobados y rechazados */
export function ResumenCierre({ conteo }: ResumenCierreProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <ResumenCifra
        label="Pendientes"
        value={conteo?.PENDIENTE ?? "--"}
        className={conteo?.PENDIENTE ? TONE_TEXT.warning : undefined}
      />
      <ResumenCifra
        label="Aprobados"
        value={conteo?.APROBADO ?? "--"}
        className={TONE_TEXT.success}
      />
      <ResumenCifra
        label="Rechazados"
        value={conteo?.RECHAZADO ?? "--"}
        className={conteo?.RECHAZADO ? TONE_TEXT.danger : undefined}
      />
    </div>
  );
}
