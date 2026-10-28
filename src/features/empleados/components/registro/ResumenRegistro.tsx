import { CheckIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { useCrearEmpleado } from "../../hooks/useCrearEmpleado";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";
import { RegistroFooter } from "./RegistroFooter";
import { ResumenContrato } from "./resumen/ResumenContrato";
import { ResumenDerechohabientes } from "./resumen/ResumenDerechohabientes";
import { ResumenEmpleado } from "./resumen/ResumenEmpleado";
import { ResumenFinancieros } from "./resumen/ResumenFinancieros";

/**
 * Paso 5 del registro: resumen de todo lo ingresado y confirmación
 *
 * @remarks
 * Es la única pantalla que envía datos al backend. Si el envío falla a la
 * mitad, el empleado ya quedó creado: se avisa y el botón reintenta solo lo
 * que falta. Desde ese momento no se puede volver a los pasos anteriores,
 * porque lo que se cambie ya no se enviaría.
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
  const empleadoCreado = useNuevoEmpleadoStore(
    (state) => state.progreso.empleadoId !== null,
  );

  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);

  const mutation = useCrearEmpleado();

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
      {mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {getApiErrorMessage(mutation.error)}
            {empleadoCreado &&
              " El empleado ya se creó: al reintentar se completará solo lo que falta."}
          </AlertDescription>
        </Alert>
      )}

      <ResumenEmpleado datos={datos} />
      <ResumenFinancieros datos={datosFinancieros} />
      <ResumenContrato contrato={contrato} />
      <ResumenDerechohabientes derechohabientes={derechohabientes} />

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
