import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

import { useNuevoEmpleadoStore } from "../store/nuevoEmpleado.store";

/**
 * Avisa antes de salir del registro si el empleado ya se creó a medias
 *
 * @remarks
 * Mientras el envío no termina, salir deja un empleado sin sus datos
 * financieros, contrato o derechohabientes. Si hay que avisar, bloquea la
 * navegación dentro de la aplicación (se confirma con `leave` o `stay`) y
 * pide confirmación del navegador al recargar o cerrar la pestaña.
 *
 * @returns Si se está pidiendo confirmación y las dos respuestas posibles
 */
export function useAvisoSalidaRegistro() {
  const empleadoCreado = useNuevoEmpleadoStore(
    (state) => state.progreso.empleadoId !== null,
  );

  const blocker = useBlocker(empleadoCreado);

  useEffect(() => {
    if (!empleadoCreado) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) =>
      event.preventDefault();

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [empleadoCreado]);

  return {
    isBlocked: blocker.state === "blocked",
    /** Se queda en el registro */
    stay: () => {
      if (blocker.state === "blocked") blocker.reset();
    },
    /** Sale del registro y descarta el borrador */
    leave: () => {
      if (blocker.state === "blocked") blocker.proceed();
    },
  };
}
