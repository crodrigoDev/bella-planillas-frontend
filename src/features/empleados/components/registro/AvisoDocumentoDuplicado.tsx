import { TriangleAlertIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { buildEmpleadoPath } from "@/app/routes/path";
import { TONE_BADGE } from "@/components/feedback/statusTone.config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { EstadoLaboral } from "../../types/empleados.types";

/** Datos mínimos del colaborador ya registrado con el documento consultado */
export interface EmpleadoDuplicado {
  id: string;
  activo: boolean;
  estado_laboral: EstadoLaboral;
}

interface AvisoDocumentoDuplicadoProps {
  empleado: EmpleadoDuplicado;
}

/**
 * Aviso ámbar cuando el documento ingresado ya existe en el sistema
 */
export function AvisoDocumentoDuplicado({
  empleado,
}: AvisoDocumentoDuplicadoProps) {
  const dadoDeBaja =
    !empleado.activo ||
    empleado.estado_laboral === "CESADO" ||
    empleado.estado_laboral === "DESPEDIDO";

  return (
    <Alert className={TONE_BADGE.warning}>
      <TriangleAlertIcon aria-hidden />
      <AlertDescription className="text-warning-soft-foreground">
        <span>
          Ya hay un colaborador registrado con este documento; no se puede
          registrar otra vez.{" "}
          {dadoDeBaja &&
            "Está dado de baja: puedes reactivarlo desde su ficha. "}
          <Link to={buildEmpleadoPath(empleado.id)} className="font-medium">
            Ver ficha
          </Link>
        </span>
      </AlertDescription>
    </Alert>
  );
}
