import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { ESTADO_CIVIL_OPTIONS, SEXO_OPTIONS } from "@/lib/personas.config";
import type { SelectOption } from "@/lib/types/options.types";
import { VINCULO_OPTIONS } from "../config/derechohabientes.config";

interface DerechohabienteCamposProps {
  /** Tipos de documento; los trae quien usa los campos, porque el catálogo vive en `empleados` */
  tiposDocumento: SelectOption[] | undefined;
  isLoadingTiposDocumento: boolean;
}

/**
 * Campos de un derechohabiente: vínculo, documento, nombre, sexo, estado civil y nacimiento
 *
 * @remarks
 * Los usan el paso 4 del registro y el modal de la ficha. Deben estar dentro
 * de un `FormProvider` cuyo formulario tenga los nombres de campo de
 * `RegistrarDerechohabienteSchema`.
 */
export function DerechohabienteCampos({
  tiposDocumento,
  isLoadingTiposDocumento,
}: DerechohabienteCamposProps) {
  return (
    <>
      <SelectField
        name="vinculo"
        label="Vínculo"
        required
        options={VINCULO_OPTIONS}
        placeholder="Selecciona un vínculo"
      />
      <SelectField
        name="documento_id"
        label="Tipo de documento"
        required
        options={tiposDocumento}
        placeholder="Selecciona un tipo"
        isLoading={isLoadingTiposDocumento}
      />
      <TextField
        name="nro_documento"
        label="Nº de documento"
        required
        placeholder="8 a 20 caracteres"
      />
      <TextField name="nombres" label="Nombres" required />
      <TextField name="apellidos" label="Apellidos" required />
      <SelectField
        name="sexo"
        label="Sexo"
        required
        options={SEXO_OPTIONS}
        placeholder="Selecciona el sexo"
      />
      <SelectField
        name="estado_civil"
        label="Estado civil"
        required
        options={ESTADO_CIVIL_OPTIONS}
        placeholder="Selecciona un estado civil"
      />
      <TextField
        name="fecha_nacimiento"
        label="Fecha de nacimiento"
        required
        type="date"
      />
    </>
  );
}
