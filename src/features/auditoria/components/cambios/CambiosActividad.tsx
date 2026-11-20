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
  CambioElemento,
  DetalleElemento,
} from "../../types/auditoria.types";
import {
  buildMatrizCambios,
  formatValorActividad,
  getModoCambios,
  getTextoModo,
  getTextoProtegido,
  type ModoCambios,
} from "../../utils/cambios.utils";

interface CambiosActividadProps {
  cambios: CambioActividad[];
  /** Acción de negocio de la fila (`accion_etiqueta`); decide qué columnas se ven */
  accion: string;
}

/**
 * Cambios de una fila de actividad: tabla de campos simples y matrices para las listas
 *
 * @remarks
 * La comparten el detalle de la auditoría y el historial del colaborador. Los
 * valores ya vienen legibles del backend. En una creación solo se ve el valor
 * nuevo y en una eliminación solo el anterior, con una línea aclaratoria antes
 * de las tablas. Un campo protegido no muestra su valor, y cada campo de tipo
 * lista (por ejemplo el horario semanal) se muestra aparte como una tabla
 * matriz con scroll horizontal cuando no cabe en el ancho disponible.
 */
export function CambiosActividad({ cambios, accion }: CambiosActividadProps) {
  const modo = getModoCambios(accion);
  const textoModo = getTextoModo(modo);
  const simples = cambios.filter(
    (cambio) => cambio.protegido || cambio.tipo !== "lista",
  );
  const listas = cambios.filter(
    (cambio) => !cambio.protegido && cambio.tipo === "lista",
  );

  return (
    <div className="space-y-4">
      {textoModo && (
        <p className="text-sm text-muted-foreground">{textoModo}</p>
      )}

      {simples.length > 0 && (
        <div className="overflow-hidden rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-52">Campo</TableHead>
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
              {simples.map((cambio) => (
                <FilaCambio key={cambio.campo} cambio={cambio} modo={modo} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {listas.map((cambio) => (
        <ListaCambios key={cambio.campo} cambio={cambio} modo={modo} />
      ))}
    </div>
  );
}

interface FilaCambioProps {
  cambio: CambioActividad;
  modo: ModoCambios;
}

const CELDA = "align-top whitespace-normal wrap-break-word";

function FilaCambio({ cambio, modo }: FilaCambioProps) {
  const { etiqueta, protegido } = cambio;
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

interface ListaCambiosProps {
  cambio: CambioActividad;
  modo: ModoCambios;
}

/** Bloque de un campo lista con su etiqueta y la matriz de elementos y campos */
function ListaCambios({ cambio, modo }: ListaCambiosProps) {
  const detalle = cambio.detalle;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{cambio.etiqueta}</p>
      {detalle?.length ? (
        <MatrizLista detalle={detalle} modo={modo} />
      ) : (
        <p className="text-sm text-muted-foreground">
          No hay detalle para mostrar.
        </p>
      )}
    </div>
  );
}

interface MatrizListaProps {
  detalle: DetalleElemento[];
  modo: ModoCambios;
}

/** Tabla matriz donde cada fila es un elemento de la lista y cada columna un campo */
function MatrizLista({ detalle, modo }: MatrizListaProps) {
  const { columnas, filas } = buildMatrizCambios(detalle);

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="sr-only">Elemento</span>
            </TableHead>
            {columnas.map((columna) => (
              <TableHead
                key={columna.campo}
                className="whitespace-normal align-bottom"
              >
                {columna.etiqueta}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((fila) => (
            <TableRow key={fila.elemento}>
              <TableCell className="font-medium">{fila.etiqueta}</TableCell>
              {columnas.map((columna) => (
                <CeldaMatriz
                  key={columna.campo}
                  cambio={fila.celdas[columna.campo]}
                  modo={modo}
                />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface CeldaMatrizProps {
  cambio: CambioElemento | undefined;
  modo: ModoCambios;
}

function CeldaMatriz({ cambio, modo }: CeldaMatrizProps) {
  if (!cambio)
    return <TableCell className="text-muted-foreground">—</TableCell>;

  if (modo === "comparacion")
    return (
      <TableCell>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-muted-foreground">
            {formatValorActividad(cambio.antes)}
          </span>
          <ArrowRightIcon
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-label="cambió a"
          />
          <span>{formatValorActividad(cambio.despues)}</span>
        </span>
      </TableCell>
    );

  return (
    <TableCell>
      {formatValorActividad(
        modo === "valores" ? cambio.despues : cambio.antes,
      )}
    </TableCell>
  );
}
