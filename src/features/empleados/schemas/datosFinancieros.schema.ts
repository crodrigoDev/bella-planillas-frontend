import {
  CrearDatoFinancieroSchema,
  CrearEmpleadoSchema,
} from "@jyp/shared-contracts";

/**
 * Crea el esquema del paso 2 (datos financieros) del registro de un empleado
 *
 * @param esRegimenAfp - Indica si un régimen de pensión es el de las AFP (SPP)
 *
 * @remarks
 * Parte del esquema del contrato, que es el que valida el backend. Agrega
 * la fecha de filiación AFP, que se guarda en el empleado y no en los datos
 * financieros, y repite la regla del backend: con AFP son obligatorios la
 * administradora, el CUSPP, la comisión y la fecha de filiación.
 * El `empleado_id` no va aquí porque el empleado aún no existe.
 */
export const createDatosFinancierosSchema = (
  esRegimenAfp: (idRegimen: string) => boolean,
) =>
  CrearDatoFinancieroSchema.omit({ empleado_id: true })
    // La fecha de filiación se guarda en el empleado: se reutiliza su regla
    .extend({ afp_fecha_filiacion: CrearEmpleadoSchema.shape.afp_fecha_filiacion })
    .superRefine((datos, ctx) => {
      if (!esRegimenAfp(datos.id_regimen)) return;

      const camposAfp = [
        ["id_tipo_afp", datos.id_tipo_afp],
        ["cuspp", datos.cuspp],
        ["tipo_comision", datos.tipo_comision],
        ["afp_fecha_filiacion", datos.afp_fecha_filiacion],
      ] as const;

      camposAfp.forEach(([campo, valor]) => {
        if (!valor)
          ctx.addIssue({
            code: "custom",
            path: [campo],
            message: "Es obligatorio con el régimen AFP",
          });
      });
    });

/** Datos del paso 2 ya validados */
export type DatosFinancierosDraft = ReturnType<
  typeof createDatosFinancierosSchema
>["_output"];
