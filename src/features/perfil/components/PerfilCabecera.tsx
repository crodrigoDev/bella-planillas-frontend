import { LogOutIcon } from "lucide-react";

import { StatusBadge } from "@/components/feedback/StatusBadge";
import { LoadingButton } from "@/components/form/LoadingButton";
import { getRolLabel } from "../config/perfil.config";
import type { MiPerfil } from "../types/perfil.types";

interface PerfilCabeceraProps {
  perfil: MiPerfil;
  onLogout: () => void;
  isLoggingOut: boolean;
}

/** Hasta dos iniciales del nombre, o la primera letra del correo */
const getIniciales = (perfil: MiPerfil): string => {
  const nombre = perfil.empleado?.nombre_completo ?? perfil.email;

  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toLocaleUpperCase("es-PE"))
    .join("");
};

/**
 * Cabecera del perfil: iniciales, nombre, correo, rol y botón para cerrar sesión
 *
 * @remarks
 * El nombre es el del colaborador; sin colaborador se usa el correo.
 */
export function PerfilCabecera({
  perfil,
  onLogout,
  isLoggingOut,
}: PerfilCabeceraProps) {
  const nombre = perfil.empleado?.nombre_completo ?? perfil.email;

  return (
    <div className="flex flex-wrap items-center gap-4 border-b pb-6">
      <span
        aria-hidden
        className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground"
      >
        {getIniciales(perfil)}
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold wrap-break-word">{nombre}</h2>
          <StatusBadge tone="info">{getRolLabel(perfil.rol)}</StatusBadge>
        </div>
        {perfil.empleado && (
          <p className="text-sm text-muted-foreground wrap-break-word">
            {perfil.email}
          </p>
        )}
      </div>

      <LoadingButton
        variant="outline"
        isLoading={isLoggingOut}
        loadingText="Cerrando sesión..."
        icon={LogOutIcon}
        onClick={onLogout}
      >
        Cerrar sesión
      </LoadingButton>
    </div>
  );
}
