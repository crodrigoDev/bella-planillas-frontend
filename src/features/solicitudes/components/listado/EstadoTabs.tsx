import { useSearchParams } from "react-router-dom";

import { PageTabs, type PageTab } from "@/components/page/PageTabs";
import { applyParamChanges } from "@/lib/urlParams.utils";
import {
  ESTADOS_SOLICITUD,
  getEstadoLabel,
} from "../../config/solicitudes.config";
import type {
  EstadoSolicitud,
  SolicitudesPorEstado,
} from "../../types/solicitudes.types";

interface EstadoTabsProps {
  /** Estado elegido; `undefined` es la pestaña "Todas" */
  value: EstadoSolicitud | undefined;
  /** Conteos por estado; mientras no llegan, las pestañas no muestran número */
  porEstado: SolicitudesPorEstado | undefined;
  /** Total sin el filtro de estado, para "Todas" */
  total: number | undefined;
}

/**
 * Pestañas del listado por estado de la solicitud, cada una con su conteo
 *
 * @remarks
 * Usa `PageTabs`: cada pestaña es un enlace a la misma página con `?estado=`,
 * conservando los demás filtros y volviendo a la primera página. Los conteos
 * respetan esos filtros pero no el de estado, así que cada pestaña dice
 * cuántas solicitudes tendría.
 */
export function EstadoTabs({ value, porEstado, total }: EstadoTabsProps) {
  const [searchParams] = useSearchParams();

  const buildTab = (
    estado: EstadoSolicitud | undefined,
    label: string,
    count: number | undefined,
  ): PageTab => ({
    to: `?${applyParamChanges(searchParams, { estado, page: undefined })}`,
    active: estado === value,
    label: (
      <span className="inline-flex items-center gap-2">
        {label}
        {count !== undefined && (
          <span className="rounded-full bg-muted px-1.5 text-xs text-muted-foreground tabular-nums">
            {count}
          </span>
        )}
      </span>
    ),
  });

  const tabs = [
    buildTab(undefined, "Todas", total),
    ...ESTADOS_SOLICITUD.map((estado) =>
      buildTab(estado, getEstadoLabel(estado), porEstado?.[estado]),
    ),
  ];

  return <PageTabs tabs={tabs} label="Estado de las solicitudes" />;
}
