import { Link } from "react-router-dom";

import { buildEmpleadoPath } from "@/app/routes/path";
import type { PerfilEmpleado } from "../types/perfil.types";
import { DatoPerfil } from "./DatoPerfil";

interface ColaboradorPerfilCardProps {
  empleado: PerfilEmpleado | null;
}

/**
 * Datos del colaborador vinculado a la cuenta
 *
 * @remarks
 * Si la cuenta no tiene colaborador asociado, avisa en vez de mostrar datos.
 * El nombre lleva a la ficha del colaborador.
 */
export function ColaboradorPerfilCard({
  empleado,
}: ColaboradorPerfilCardProps) {
  return (
    <section aria-labelledby="colaborador-perfil-title">
      <h2 id="colaborador-perfil-title" className="text-base font-semibold">
        Colaborador
      </h2>

      {empleado ? (
        <dl className="mt-1 divide-y border-t">
          <DatoPerfil label="Nombre">
            <Link
              to={buildEmpleadoPath(empleado.id)}
              className="text-primary hover:underline"
            >
              {empleado.nombre_completo}
            </Link>
          </DatoPerfil>
          <DatoPerfil label="Documento">{empleado.nro_documento}</DatoPerfil>
          <DatoPerfil label="Área">{empleado.area}</DatoPerfil>
          <DatoPerfil label="Cargo">{empleado.cargo}</DatoPerfil>
        </dl>
      ) : (
        <p className="mt-1 border-t pt-3 text-sm text-muted-foreground">
          Esta cuenta no tiene un colaborador asociado.
        </p>
      )}
    </section>
  );
}
