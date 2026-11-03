import { CrearDatoFinancieroSchema } from "@jyp/shared-contracts";

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
 * está en el empleado y la comprueba el backend.
 */
export const createDatosFinancierosFichaSchema = ({
  esRegimenAfp,
  cusppRegistrado,
}: Opciones) =>
  CrearDatoFinancieroSchema.omit({ empleado_id: true }).superRefine(
    (datos, ctx) => {
      if (!esRegimenAfp(datos.id_regimen)) return;

      const camposAfp: [string, unknown][] = [
        ["id_tipo_afp", datos.id_tipo_afp],
        ["tipo_comision", datos.tipo_comision],
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

/** Datos del formulario ya validados */
export type DatosFinancierosFichaDatos = ReturnType<
  typeof createDatosFinancierosFichaSchema
>["_output"];
