import { formatFechaHoraLima } from "@/lib/date.utils";
import { getRolLabel } from "../config/perfil.config";
import type { MiPerfil } from "../types/perfil.types";
import { DatoPerfil } from "./DatoPerfil";

interface CuentaCardProps {
  perfil: MiPerfil;
}

/**
 * Datos de la cuenta: correo, rol y último acceso
 */
export function CuentaCard({ perfil }: CuentaCardProps) {
  return (
    <section aria-labelledby="cuenta-perfil-title">
      <h2 id="cuenta-perfil-title" className="text-base font-semibold">
        Cuenta
      </h2>

      <dl className="mt-1 divide-y border-t">
        <DatoPerfil label="Correo">{perfil.email}</DatoPerfil>
        <DatoPerfil label="Rol">{getRolLabel(perfil.rol)}</DatoPerfil>
        <DatoPerfil label="Último acceso">
          {perfil.ultimo_acceso
            ? formatFechaHoraLima(perfil.ultimo_acceso)
            : "--"}
        </DatoPerfil>
      </dl>
    </section>
  );
}
