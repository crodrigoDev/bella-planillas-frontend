import { ResumenCampo } from "@/components/form/ResumenCampo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orDash } from "@/lib/format.utils";
import type {
  CabeceraPlanilla,
  PlanillaDetalle,
} from "../../types/planillas.types";
import { esRegimenOnp, formatTasaAfp } from "../../utils/planillas.utils";

interface PlanillaCabeceraCardProps {
  planilla: PlanillaDetalle;
  cabecera: CabeceraPlanilla;
  nombre: string | null;
}

/**
 * Tarjeta con los datos del colaborador y condiciones aplicadas en la planilla
 */
export function PlanillaCabeceraCard({
  planilla,
  cabecera,
  nombre,
}: PlanillaCabeceraCardProps) {
  const esOnp = esRegimenOnp(planilla, cabecera);

  const asignacionFamiliar =
    cabecera.asignacion_familiar === null
      ? orDash(null)
      : cabecera.asignacion_familiar
        ? "Sí"
        : "No";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del colaborador</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResumenCampo label="Colaborador" value={orDash(nombre)} />
        <ResumenCampo
          label="DNI / documento"
          value={orDash(cabecera.nro_documento)}
        />
        <ResumenCampo label="Cargo" value={orDash(cabecera.cargo)} />
        <ResumenCampo label="Área" value={orDash(cabecera.area)} />
        <ResumenCampo
          label="Régimen de pensión"
          value={orDash(cabecera.regimen_pension)}
        />
        {!esOnp && (
          <ResumenCampo
            label="Tasa AFP"
            value={formatTasaAfp(planilla.tasa_afp_aplicada)}
          />
        )}
        <ResumenCampo
          label="Días laborados"
          value={`${planilla.dias_laborados} días`}
        />
        <ResumenCampo label="Asignación familiar" value={asignacionFamiliar} />
      </CardContent>
    </Card>
  );
}
