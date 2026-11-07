import { useMutation } from "@tanstack/react-query";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { PageHeader } from "@/components/page/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ColaboradorPerfilCard } from "@/features/perfil/components/ColaboradorPerfilCard";
import { CuentaCard } from "@/features/perfil/components/CuentaCard";
import { PerfilCabecera } from "@/features/perfil/components/PerfilCabecera";
import { useMiPerfil } from "@/features/perfil/hooks/useMiPerfil";

/**
 * Mi perfil: los datos de la cuenta con sesión y su colaborador, de solo lectura
 *
 * @remarks
 * El backend no tiene cómo editar el perfil ni cambiar la contraseña con la
 * sesión iniciada. Lo único que se hace desde aquí es cerrar sesión.
 */
export default function PerfilPage() {
  const { logout } = useAuth();
  const { data, isLoading, error, refetch } = useMiPerfil();
  const logoutMutation = useMutation({ mutationFn: logout, retry: false });

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-6"
      aria-labelledby="perfil-title"
    >
      <PageHeader
        id="perfil-title"
        title="Mi perfil"
        description="Los datos de tu cuenta"
      />

      <ErrorAlert
        error={error}
        title="No se pudo cargar tu perfil"
        onRetry={() => refetch()}
      />
      <ErrorAlert
        error={logoutMutation.error}
        title="No se pudo cerrar sesión"
      />

      {isLoading && <Skeleton className="h-48 w-full" />}

      {data && (
        <>
          <PerfilCabecera
            perfil={data}
            isLoggingOut={logoutMutation.isPending}
            onLogout={() => logoutMutation.mutate()}
          />
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <CuentaCard perfil={data} />
            <ColaboradorPerfilCard empleado={data.empleado} />
          </div>
        </>
      )}
    </section>
  );
}
