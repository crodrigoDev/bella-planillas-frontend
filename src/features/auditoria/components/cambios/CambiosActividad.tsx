import { ArrowRightIcon, LockIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  CambioActividad,
  DetalleElemento,
} from "../../types/auditoria.types";
import {
  formatValorActividad,
  getModoCambios,
  getTextoProtegido,
  type ModoCambios,
} from "../../utils/cambios.utils";

interface CambiosActividadProps {
  cambios: CambioActividad[];
  /** Acción de negocio de la fila (`accion_etiqueta`); decide qué columnas se ven */
  accion: string;
}

/**
 * Tabla con los campos que cambiaron en una fila de actividad
 *
 * @remarks
 * La comparten el detalle de la auditoría y el historial del colaborador. Los
 * valores ya vienen legibles del backend. En una creación solo se ve el valor
 * nuevo y en una eliminación solo el anterior. Un campo protegido no muestra
 * su valor, y una lista (por ejemplo el horario semanal) se muestra por
 * elemento, con los campos que cambiaron en cada uno. Los elementos se acomodan
 * en columnas según el ancho disponible, así que sirve igual en una tarjeta
 * angosta que en una página ancha.
 */
export function CambiosActividad({ cambios, accion }: CambiosActividadProps) {
  const modo = getModoCambios(accion);

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campo</TableHead>
            {modo === "comparacion" ? (
              <>
                <TableHead>Antes</TableHead>
                <TableHead>Después</TableHead>
              </>
            ) : (
              <TableHead>
                {modo === "valores" ? "Valor" : "Valor anterior"}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cambios.map((cambio) => (
            <FilaCambio key={cambio.campo} cambio={cambio} modo={modo} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface FilaCambioProps {
  cambio: CambioActividad;
  modo: ModoCambios;
}

const CELDA = "align-top whitespace-normal wrap-break-word";

function FilaCambio({ cambio, modo }: FilaCambioProps) {
  const { etiqueta, protegido, tipo, detalle } = cambio;
  const columnas = modo === "comparacion" ? 2 : 1;

  const campo = (
    <TableCell className={`${CELDA} font-medium`}>{etiqueta}</TableCell>
  );

  if (protegido)
    return (
      <TableRow>
        {campo}
        <TableCell
          colSpan={columnas}
          className={`${CELDA} text-muted-foreground`}
        >
          <span className="inline-flex items-center gap-1.5">
            <LockIcon className="size-3.5 shrink-0" aria-hidden />
            {getTextoProtegido(modo)}
          </span>
        </TableCell>
      </TableRow>
    );

  if (tipo === "lista")
    return (
      <TableRow>
        {campo}
        <TableCell colSpan={columnas} className={CELDA}>
          {detalle?.length ? (
            <div className="@container">
              <div className="grid gap-3 @md:grid-cols-2 @3xl:grid-cols-3">
                {detalle.map((elemento) => (
                  <ElementoLista
                    key={elemento.elemento}
                    elemento={elemento}
                    modo={modo}
                  />
                ))}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">
              No hay detalle para mostrar.
            </span>
          )}
        </TableCell>
      </TableRow>
    );

  if (modo === "comparacion")
    return (
      <TableRow>
        {campo}
        <TableCell className={`${CELDA} text-muted-foreground`}>
          {formatValorActividad(cambio.antes)}
        </TableCell>
        <TableCell className={CELDA}>
          {formatValorActividad(cambio.despues)}
        </TableCell>
      </TableRow>
    );

  return (
    <TableRow>
      {campo}
      <TableCell className={CELDA}>
        {formatValorActividad(
          modo === "valores" ? cambio.despues : cambio.antes,
        )}
      </TableCell>
    </TableRow>
  );
}

interface ElementoListaProps {
  elemento: DetalleElemento;
  modo: ModoCambios;
}

/** Un elemento de una lista (por ejemplo "Martes") con los campos que cambiaron */
function ElementoLista({ elemento, modo }: ElementoListaProps) {
  return (
    <div className="space-y-1.5 rounded-md border bg-muted/30 p-3">
      <p className="font-medium">{elemento.etiqueta}</p>
      <dl className="space-y-0.5 text-sm">
        {elemento.cambios.map((cambio) => (
          <div
            key={cambio.campo}
            className="flex flex-wrap items-baseline gap-x-2"
          >
            <dt className="text-muted-foreground">{cambio.etiqueta}:</dt>
            {modo === "comparacion" ? (
              <dd className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground">
                  {formatValorActividad(cambio.antes)}
                </span>
                <ArrowRightIcon
                  className="size-3.5 text-muted-foreground"
                  aria-label="cambió a"
                />
                <span>{formatValorActividad(cambio.despues)}</span>
              </dd>
            ) : (
              <dd>
                {formatValorActividad(
                  modo === "valores" ? cambio.despues : cambio.antes,
                )}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
