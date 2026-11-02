import type { SelectOption } from "@/lib/types/options.types";

/**
 * DATOS TEMPORALES: catálogos que el backend todavía no expone.
 *
 * Los ids son los que generó el seed de la base de datos local
 * (`prisma/seeders/bancos-afp-comisiones.seeder.ts`). Cada vez que se vuelve
 * a crear la base de datos, el seed genera ids nuevos y estos dejan de valer:
 * hay que volver a leerlos de las tablas `tipo_documento` y `regimen_pension`.
 *
 * Se eliminan cuando existan estos endpoints en el backend:
 * - tipos de documento (`tipo_documento`)
 * - regímenes de pensión (`regimen_pension`)
 * - modalidades de contrato (el backend solo guarda el texto en
 *   `contrato.tipo_modalidad`, sin una lista definida)
 */

/** Tipos de documento, tal como están en la tabla `tipo_documento` */
export const TIPOS_DOCUMENTO_MOCK: SelectOption[] = [
  { value: "01a19cb2-9609-7ecf-8f86-36bcd177a419", label: "DNI" },
  { value: "01a19cb2-9611-7d93-a061-a2101355c4b4", label: "CE" },
  { value: "01a19cb2-9613-782a-a983-27ba7613eebe", label: "PASAPORTE" },
];
