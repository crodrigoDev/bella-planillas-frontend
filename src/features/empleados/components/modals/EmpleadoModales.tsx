import type { Empleado } from "../../types/empleados.types";
import { CambiarEstadoModal } from "./CambiarEstadoModal";
import { DarDeBajaModal } from "./DarDeBajaModal";
import { ReactivarModal } from "./ReactivarModal";

/**
 * Modales de estado que se abren desde las acciones de un empleado
 */
export type EmpleadoModal = "estado" | "baja" | "reactivar";

interface EmpleadoModalesProps {
  empleado: Empleado;
  /** Modal abierto; null si ninguno */
  openModal: EmpleadoModal | null;
  onClose: () => void;
}

/**
 * Los tres modales de estado de un empleado: cambiar estado, dar de baja y reactivar
 *
 * @remarks
 * Los comparten el menú de la fila del listado y la cabecera de la ficha.
 */
export function EmpleadoModales({
  empleado,
  openModal,
  onClose,
}: EmpleadoModalesProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <>
      <CambiarEstadoModal
        empleado={empleado}
        open={openModal === "estado"}
        onOpenChange={handleOpenChange}
      />
      <DarDeBajaModal
        empleado={empleado}
        open={openModal === "baja"}
        onOpenChange={handleOpenChange}
      />
      <ReactivarModal
        empleado={empleado}
        open={openModal === "reactivar"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
