import { Link } from "react-router-dom";
import { UserRound, ShieldCheck, BriefcaseBusiness } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ModulePage from "@/components/modules/ModulePage";
import { moduleDate } from "@/components/modules/module.utils";
import { PERFIL_MOCK } from "../data/perfil.mock";

/** Muestra los campos de la consulta de perfil sin inventar una edicion */
export default function PerfilView() {
  const perfil = PERFIL_MOCK;
  const fields = [
    { label: "Correo electrónico", value: perfil.email },
    { label: "Rol", value: "Recursos Humanos" },
    { label: "Último acceso", value: moduleDate(perfil.ultimo_acceso) },
  ];
  return (
    <ModulePage
      title="Mi perfil"
      description="Información de la cuenta y del empleado vinculado"
    >
      <div className="grid max-w-5xl gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader className="items-center gap-3 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-primary/10 text-xl text-primary">
                RH
              </AvatarFallback>
            </Avatar>
            <CardTitle>
              {perfil.empleado?.nombre_completo ?? "Recursos Humanos"}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{perfil.email}</p>
          </CardHeader>
          <CardContent className="flex items-center justify-center gap-2 text-xs text-primary">
            <ShieldCheck aria-hidden className="size-4" />
            Cuenta de Recursos Humanos
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <UserRound aria-hidden className="size-4 text-primary" />
                Datos de la cuenta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                {fields.map((field) => (
                  <div key={field.label}>
                    <dt className="text-xs text-muted-foreground">
                      {field.label}
                    </dt>
                    <dd className="mt-1 text-sm">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BriefcaseBusiness
                  aria-hidden
                  className="size-4 text-primary"
                />
                Empleado vinculado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {perfil.empleado ? (
                <>
                  <dl className="grid gap-4 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Documento</dt>
                      <dd className="mt-1">{perfil.empleado.nro_documento}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Área</dt>
                      <dd className="mt-1">{perfil.empleado.area}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground">Cargo</dt>
                      <dd className="mt-1">{perfil.empleado.cargo}</dd>
                    </div>
                  </dl>
                  <Link
                    to={`/empleados/${perfil.empleado.id}`}
                    className="mt-5 inline-block text-xs text-primary hover:underline"
                  >
                    Ver ficha del empleado →
                  </Link>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Esta cuenta no tiene un empleado vinculado
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ModulePage>
  );
}
