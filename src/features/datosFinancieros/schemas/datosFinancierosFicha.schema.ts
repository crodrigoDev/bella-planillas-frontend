import { zodResolver } from "@hookform/resolvers/zod";
import {
  CrearDatoFinancieroSchema,
  CrearEmpleadoSchema,
} from "@jyp/shared-contracts";

import { zodResolverOptions } from "@/lib/zodMessages.utils";

interface Opciones {
  /** Indica si un régimen de pensión (por su id) es el de las AFP */
  esRegimenAfp: (idRegimen: string) => boolean;
  /** En la edición, un CUSPP ya guardado no se vuelve a pedir: llega enmascarado */
  cusppRegistrado: boolean;
}

/**
 * Crea el esquema del formulario de datos financieros de la ficha (alta y edición)
 *
 * @remarks
 * Parte del esquema del contrato, que es el que valida el backend, sin el
 * `empleado_id` (lo pone la ficha). Repite la regla del backend: con AFP son
 * obligatorios la administradora, el CUSPP y la comisión. La fecha de filiación
 * se guarda en el empleado: se pide aquí porque cambiar a AFP la necesita, y
 * quien usa el esquema la envía aparte, antes que los datos financieros.
 */
export const createDatosFinancierosFichaSchema = ({
  esRegimenAfp,
  cusppRegistrado,
}: Opciones) =>
  CrearDatoFinancieroSchema.omit({ empleado_id: true })
    // La fecha de filiación se guarda en el empleado: se reutiliza su regla
    .extend({
      afp_fecha_filiacion: CrearEmpleadoSchema.shape.afp_fecha_filiacion,
    })
    .superRefine(
      (datos, ctx) => {
        if (!esRegimenAfp(datos.id_regimen)) return;

        const camposAfp: [string, unknown][] = [
          ["id_tipo_afp", datos.id_tipo_afp],
          ["tipo_comision", datos.tipo_comision],
          ["afp_fecha_filiacion", datos.afp_fecha_filiacion],
        ];

        if (!cusppRegistrado) camposAfp.push(["cuspp", datos.cuspp]);

        camposAfp.forEach(([campo, valor]) => {
          if (!valor)
            ctx.addIssue({
              code: "custom",
              path: [campo],
              message: "Es obligatorio con el régimen AFP",
            });
        });
      },
    );

/** Resolver de react-hook-form para el esquema del formulario, con los mensajes en español */
export const createDatosFinancierosFichaResolver = (opciones: Opciones) =>
  zodResolver(createDatosFinancierosFichaSchema(opciones), zodResolverOptions);

/** Datos del formulario ya validados */
export type DatosFinancierosFichaDatos = ReturnType<
  typeof createDatosFinancierosFichaSchema
>["_output"];

/**
 * Valores del formulario antes de validar
 *
 * @remarks
 * Los campos que tienen un valor por defecto en el contrato todavía son opcionales.
 */
export type DatosFinancierosFichaFormValues = Parameters<
  ReturnType<typeof createDatosFinancierosFichaResolver>
>[0];
