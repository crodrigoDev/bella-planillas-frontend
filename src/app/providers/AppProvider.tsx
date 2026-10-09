import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/config/query-client.config";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Agrupa los Providers globales de la aplicación
 *
 * @param props - Propiedades que contienen los componentes hijos
 * @returns Los componentes hijos envueltos en los Providers globales
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider delay={0}>{children}</TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
