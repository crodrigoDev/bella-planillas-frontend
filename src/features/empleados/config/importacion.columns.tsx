import { createColumnHelper } from "@tanstack/react-table";
import type { CargaMasivaFilaDTO } from "@jyp/shared-contracts";
import type { DataTableFeatures } from "@/components/data-table/data-table.config";
import type { ErrorImportacion } from "../types/importar-empleados.types";
import { formatEmpleadoSueldo } from "../utils/empleados.utils";
import { formatImportacionValor } from "../utils/importar-empleados.utils";

const filasHelper = createColumnHelper<DataTableFeatures, CargaMasivaFilaDTO>();
const erroresHelper = createColumnHelper<DataTableFeatures, ErrorImportacion>();

export const importacionFilasColumns = filasHelper.columns([
  filasHelper.accessor("nro_documento", { header: "Documento", cell: ({ row }) => `${row.original.tipo_documento} ${row.original.nro_documento}` }),
  filasHelper.accessor("nombre", { header: "Colaborador", cell: ({ row }) => [row.original.nombre, row.original.apellido].filter(Boolean).join(" ") || "Sin nombre registrado" }),
  filasHelper.accessor("area", { header: "Área y cargo", cell: ({ row }) => <div className="max-w-64"><p className="truncate font-medium" title={row.original.area}>{row.original.area}</p><p className="mt-1 truncate text-muted-foreground" title={row.original.cargo}>{row.original.cargo}</p></div> }),
  filasHelper.accessor("jornada", { header: "Jornada", cell: ({ cell }) => cell.getValue() || "Sin jornada asignada" }),
  filasHelper.accessor("fecha_inicio", { header: "Fecha de ingreso" }),
  filasHelper.accessor("sueldo_basico", { header: "Sueldo / Pensión", cell: ({ row }) => <div><p>{formatEmpleadoSueldo(row.original.sueldo_basico)}</p><p className="mt-1 text-muted-foreground">{row.original.regimen_pension}</p></div> }),
]);

export const importacionErroresColumns = erroresHelper.columns([
  erroresHelper.accessor("fila", { header: "Fila" }),
  erroresHelper.accessor("columna", { header: "Campo" }),
  erroresHelper.accessor("valor_recibido", { header: "Valor recibido", cell: ({ cell }) => formatImportacionValor(cell.getValue()) }),
  erroresHelper.accessor("mensaje", { header: "Corrección necesaria", cell: ({ cell }) => <p className="max-w-md whitespace-normal text-destructive">{cell.getValue()}</p> }),
]);
