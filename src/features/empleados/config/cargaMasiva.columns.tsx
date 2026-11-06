import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import type {
  CargaMasivaErrorFila,
  CargaMasivaErrorTrabajo,
} from "../types/cargaMasiva.types";

const filaHelper = createColumnHelper<DataTableFeatures, CargaMasivaErrorFila>();
const trabajoHelper = createColumnHelper<
  DataTableFeatures,
  CargaMasivaErrorTrabajo
>();

/** Muestra lo que llegó en la celda; si venía vacía lo dice */
const formatValor = (valor: unknown) => {
  if (valor === null || valor === undefined || valor === "")
    return <span className="text-muted-foreground">(vacío)</span>;

  return typeof valor === "object" ? JSON.stringify(valor) : String(valor);
};

/** Columnas de los errores de cada fila del archivo (paso de revisión) */
export const erroresFilaColumns = filaHelper.columns([
  filaHelper.accessor("fila", { header: "Fila" }),
  filaHelper.accessor("columna", { header: "Columna" }),
  filaHelper.display({
    id: "valorRecibido",
    header: "Valor recibido",
    cell: ({ row }) => formatValor(row.original.valor_recibido),
  }),
  filaHelper.accessor("mensaje", { header: "Mensaje" }),
]);

/** Columnas de los empleados que no se pudieron guardar (paso de resultado) */
export const erroresTrabajoColumns = trabajoHelper.columns([
  trabajoHelper.accessor("Dni", { header: "DNI" }),
  trabajoHelper.accessor("causa", { header: "Causa" }),
]);
