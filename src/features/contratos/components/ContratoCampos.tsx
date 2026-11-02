import { useFormContext, useWatch } from "react-hook-form";

import { FormField } from "@/components/form/FormField";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { Textarea } from "@/components/ui/textarea";
import { MODALIDAD_INDETERMINADA } from "../config/contratos.config";
import { useModalidadesContrato } from "../hooks/useCatalogos";

/**
 * Campos de un contrato que se repiten en editar y renovar: modalidad,
 * fechas y observación
 *
 * @remarks
 * Debe usarse dentro de un `FormProvider` con los campos `tipo_modalidad`,
 * `fecha_inicio`, `fecha_fin` y `observacion`. La fecha de fin se oculta en
 * un contrato indeterminado.
 */
export function ContratoCampos() {
  const { register, control } = useFormContext();
  const modalidades = useModalidadesContrato();

  const modalidad = useWatch({ control, name: "tipo_modalidad" });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField
        name="tipo_modalidad"
        label="Modalidad"
        required
        options={modalidades.data}
        placeholder="Selecciona una modalidad"
        isLoading={modalidades.isLoading}
        fieldClassName="col-span-full"
      />
      <TextField
        name="fecha_inicio"
        label="Fecha de inicio"
        required
        type="date"
      />
      {modalidad !== MODALIDAD_INDETERMINADA && (
        <TextField
          name="fecha_fin"
          label="Fecha de fin"
          optional
          type="date"
        />
      )}
      <FormField
        name="observacion"
        label="Observación"
        className="col-span-full"
      >
        {(invalid) => (
          <Textarea
            id="observacion"
            maxLength={500}
            aria-invalid={invalid}
            {...register("observacion", {
              setValueAs: (value: string) => value || undefined,
            })}
          />
        )}
      </FormField>
    </div>
  );
}
