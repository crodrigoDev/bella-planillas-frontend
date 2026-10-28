import { FormProvider } from "react-hook-form";
import { PencilIcon, PlusIcon, SaveIcon, UsersIcon } from "lucide-react";

import { FormSection } from "@/components/form/FormSection";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { Button } from "@/components/ui/button";
import {
  ESTADO_CIVIL_OPTIONS,
  SEXO_OPTIONS,
  VINCULO_OPTIONS,
} from "../../config/empleados.config";
import { useDerechohabientesForm } from "../../hooks/useDerechohabientesForm";
import { useTiposDocumento } from "../../hooks/useTiposDocumento";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";
import { DerechohabientesList } from "./DerechohabientesList";
import { RegistroFooter } from "./RegistroFooter";

/**
 * Paso 4 del registro: familiares del empleado con derecho a beneficios
 *
 * @remarks
 * Es opcional. Cada derechohabiente se valida con el esquema de shared
 * contracts y se agrega a la lista del borrador del asistente; se guardan
 * junto al empleado en el último paso. La lógica está en
 * `useDerechohabientesForm`.
 */
export function DatosDerechohabientesForm() {
  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);
  const tiposDocumento = useTiposDocumento();
  const {
    methods,
    derechohabientes,
    isEditing,
    formKey,
    formAnchorRef,
    handleEdit,
    handleCancelEdit,
    handleRemove,
    handleSubmit,
  } = useDerechohabientesForm();

  return (
    <div className="space-y-6">
      <FormSection
        icon={UsersIcon}
        title="A. Derechohabientes agregados"
        description="Cónyuge, hijos y otros familiares con derecho a beneficios. Este paso es opcional."
      >
        <DerechohabientesList
          derechohabientes={derechohabientes}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      </FormSection>

      <div ref={formAnchorRef} className="scroll-mt-4" />

      <FormProvider {...methods}>
        <form key={formKey} onSubmit={handleSubmit} noValidate>
          <FormSection
            icon={isEditing ? PencilIcon : PlusIcon}
            title={
              isEditing
                ? "B. Editar derechohabiente"
                : "B. Agregar derechohabiente"
            }
            description={
              isEditing
                ? "Cambia los datos del familiar y guarda los cambios."
                : "Completa los datos del familiar y agrégalo a la lista."
            }
          >
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
              options={tiposDocumento.data}
              placeholder="Selecciona un tipo"
              isLoading={tiposDocumento.isLoading}
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

            <div className="flex justify-end gap-2 sm:col-span-2 lg:col-span-4">
              {isEditing && (
                <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                  Cancelar edición
                </Button>
              )}
              <Button type="submit" variant="outline">
                {isEditing ? (
                  <SaveIcon data-icon="inline-start" />
                ) : (
                  <PlusIcon data-icon="inline-start" />
                )}
                {isEditing ? "Guardar cambios" : "Agregar a la lista"}
              </Button>
            </div>
          </FormSection>
        </form>
      </FormProvider>

      <RegistroFooter step={3} nextLabel="Continuar" onNext={() => goToStep(4)} />
    </div>
  );
}
