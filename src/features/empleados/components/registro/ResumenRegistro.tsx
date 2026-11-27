import { CheckIcon, PencilIcon } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { AccionButton } from "@/components/page/AccionButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCrearEmpleado } from "../../hooks/useCrearEmpleado";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";
import { RegistroFooter } from "./RegistroFooter";
import { ResumenContrato } from "./resumen/ResumenContrato";
import { ResumenDerechohabientes } from "./resumen/ResumenDerechohabientes";
import { ResumenEmpleado } from "./resumen/ResumenEmpleado";
import { ResumenFinancieros } from "./resumen/ResumenFinancieros";

const MOTIVO_YA_GUARDADO =
  "Ya se guardó; podrás cambiarlo desde la ficha del colaborador.";

/**
 * Paso 5 del registro: resumen de todo lo ingresado y confirmación
 *
 * @remarks
 * Es la única pantalla que envía datos al backend. Antes de confirmar se puede
 * volver a editar cualquier paso y regresar directo al resumen. Si el envío
 * falla a la mitad, el empleado ya quedó creado: se avisa, se bloquea la
 * edición de lo que ya se guardó y el botón reintenta solo lo que falta.
 */
export function ResumenRegistro() {
  const datos = useNuevoEmpleadoStore((state) => state.datos);
  const datosFinancieros = useNuevoEmpleadoStore(
    (state) => state.datosFinancieros,
  );
  const contrato = useNuevoEmpleadoStore((state) => state.contrato);
  const derechohabientes = useNuevoEmpleadoStore(
    (state) => state.derechohabientes,
  );
  const progreso = useNuevoEmpleadoStore((state) => state.progreso);
  const empleadoCreado = progreso.empleadoId !== null;

  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);
  const editarPaso = useNuevoEmpleadoStore((state) => state.editarPaso);

  const mutation = useCrearEmpleado();

  const renderEditar = (step: number, yaGuardado: boolean) => (
    <AccionButton
      label="Editar"
      icon={PencilIcon}
      onClick={() => editarPaso(step)}
      disabledReason={
        yaGuardado
          ? MOTIVO_YA_GUARDADO
          : mutation.isPending
            ? "Guardando el registro…"
            : undefined
      }
    />
  );

  // Los pasos 1 a 3 son obligatorios: sin ellos no hay nada que confirmar
  if (!datos || !datosFinancieros || !contrato)
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            Faltan datos por completar. Vuelve a los pasos anteriores.
          </AlertDescription>
        </Alert>
        <RegistroFooter
          step={4}
          nextLabel="Ir al primer paso"
          onNext={() => goToStep(0)}
        />
      </div>
    );

  return (
    <div className="space-y-6">
      <ErrorAlert error={mutation.error}>
        {empleadoCreado &&
          " El empleado ya se creó: al reintentar se completará solo lo que falta."}
      </ErrorAlert>

      <ResumenEmpleado
        datos={datos}
        action={renderEditar(0, empleadoCreado)}
      />
      <ResumenFinancieros
        datos={datosFinancieros}
        action={renderEditar(1, empleadoCreado || progreso.financierosListos)}
      />
      <ResumenContrato
        contrato={contrato}
        action={renderEditar(2, progreso.contratoListo)}
      />
      <ResumenDerechohabientes
        derechohabientes={derechohabientes}
        action={renderEditar(3, progreso.derechohabientesListos > 0)}
      />

      <RegistroFooter
        step={4}
        nextLabel={empleadoCreado ? "Reintentar" : "Confirmar y registrar"}
        nextIcon={CheckIcon}
        onNext={() => mutation.mutate()}
        isSubmitting={mutation.isPending}
        hideBack={empleadoCreado}
      />
    </div>
  );
}
