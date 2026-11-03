import { FormProvider } from "react-hook-form";
import { PlusIcon, SaveIcon } from "lucide-react";

import { FormSection } from "@/components/form/FormSection";
import { Button } from "@/components/ui/button";
import { DerechohabienteCampos } from "@/features/derechohabientes/components/DerechohabienteCampos";
import { useDerechohabientesForm } from "../../hooks/useDerechohabientesForm";
import { useTiposDocumento } from "../../hooks/useCatalogos";
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
        title="Derechohabientes agregados"
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
            title={
              isEditing
                ? "Editar derechohabiente"
                : "Agregar derechohabiente"
            }
            description={
              isEditing
                ? "Cambia los datos del familiar y guarda los cambios."
                : "Completa los datos del familiar y agrégalo a la lista."
            }
          >
            <DerechohabienteCampos
              tiposDocumento={tiposDocumento.data}
              isLoadingTiposDocumento={tiposDocumento.isLoading}
            />

            <div className="flex justify-start gap-2 col-span-full">
              <Button type="submit" variant="outline">
                {isEditing ? (
                  <SaveIcon data-icon="inline-start" />
                ) : (
                  <PlusIcon data-icon="inline-start" />
                )}
                {isEditing ? "Guardar cambios" : "Agregar a la lista"}
              </Button>
              {isEditing && (
                <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                  Cancelar edición
                </Button>
              )}
              
            </div>
          </FormSection>
        </form>
      </FormProvider>

      <RegistroFooter step={3} nextLabel="Continuar" onNext={() => goToStep(4)} />
    </div>
  );
}
