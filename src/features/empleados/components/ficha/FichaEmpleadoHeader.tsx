import { generatePath, Link } from "react-router-dom";
import { BriefcaseBusiness, IdCard, Pencil } from "lucide-react";
import { ROUTE_PATHS } from "@/app/routes/path";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ESTADOS_LABORALES } from "../../config/empleados.config";
import { getEmpleadoNombre } from "../../utils/empleados.utils";
import type { EmpleadoMock } from "../../types/empleados.types";

interface FichaEmpleadoHeaderProps {
  empleado: EmpleadoMock;
  canManage: boolean;
}

/** Resume la identidad y situacion actual del colaborador */
export default function FichaEmpleadoHeader({ empleado, canManage }: FichaEmpleadoHeaderProps) {
  const state = ESTADOS_LABORALES[empleado.estado_laboral];
  const initials = [empleado.nombre?.[0], empleado.apellido?.[0]].filter(Boolean).join("") || "?";
  return (
    <Card className="py-5 shadow-none ring-border">
      <CardContent className="flex flex-col items-start gap-5 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex w-full min-w-0 flex-1 items-start gap-4 sm:w-auto">
          <Avatar className="size-14 shrink-0 after:hidden"><AvatarFallback className="bg-primary/8 text-lg font-semibold text-primary">{initials}</AvatarFallback></Avatar>
          <div className="min-w-0 space-y-2">
            <h2 className="break-words text-lg font-semibold text-foreground">{getEmpleadoNombre(empleado)}</h2>
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><BriefcaseBusiness aria-hidden="true" className="size-3.5 shrink-0" /><span>{empleado.cargo.nombre} · {empleado.area.nombre}</span></p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><IdCard aria-hidden="true" className="size-3.5" />{empleado.nro_documento}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={state.className}>{state.label}</Badge>
              <Badge variant="outline" className="text-muted-foreground">{empleado.activo ? "Registro activo" : "Registro inactivo"}</Badge>
            </div>
          </div>
        </div>
        {canManage && empleado.activo && (
          <Button variant="outline" size="sm" render={<Link to={generatePath(ROUTE_PATHS.gestionPersonal.editarEmpleado, { empleadoId: empleado.id })} />}>
            <Pencil aria-hidden="true" /> Editar empleado
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
