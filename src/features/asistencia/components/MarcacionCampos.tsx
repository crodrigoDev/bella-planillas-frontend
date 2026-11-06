import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { TIPO_MARCA_OPTIONS } from "../config/asistencia.config";
import { MotivoField } from "./MotivoField";

interface MarcacionCamposProps {
  /** Fecha mínima permitida (YYYY-MM-DD); sin valor, no hay mínimo */
  minFecha?: string;
  /** Fecha máxima permitida (YYYY-MM-DD) */
  maxFecha: string;
}

/**
 * Campos de una marcación manual: fecha, hora, tipo y motivo
 *
 * @remarks
 * Los usan el modal de la ficha y el del listado global. Deben estar dentro de
 * un `FormProvider` cuyo formulario tenga los campos de `MarcacionManualFormSchema`
 * y dentro de un contenedor de dos columnas.
 */
export function MarcacionCampos({ minFecha, maxFecha }: MarcacionCamposProps) {
  return (
    <>
      <TextField
        name="fecha"
        label="Fecha"
        required
        type="date"
        min={minFecha}
        max={maxFecha}
      />
      <TextField name="hora" label="Hora" required type="time" />
      <SelectField
        name="tipo_marcacion"
        label="Tipo de marcación"
        required
        options={TIPO_MARCA_OPTIONS}
        placeholder="Selecciona un tipo"
        fieldClassName="col-span-full"
      />
      <MotivoField placeholder="Por qué se registra a mano" />
    </>
  );
}
