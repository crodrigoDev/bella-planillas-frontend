import { Spinner } from "@/components/ui/spinner";
import { Building } from "lucide-react";

/**
 * Pantalla completa que indica que la sesión se esta cargando
 */
export default function SessionLoadingScreen() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background"
    >
      <Building className="size-8" aria-hidden="true" />
      <Spinner className="size-8" aria-label="Cargando" />
    </main>
  );
}
