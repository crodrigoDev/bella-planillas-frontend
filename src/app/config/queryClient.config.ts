import { QueryClient } from "@tanstack/react-query";

/**
 * Cliente compartido de TanstackQuery para toda la aplicación
 *
 * Mantiene la cache entre renders y define las opciones
 * predeterminadas de las consultas
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita nuevas consultas al volver a la pestaña
      staleTime: 60_000, // Considera los datos actualizados durante 1 minuto
      retry: 1, // Reintenta otra vez cuando la consulta falla
    },
  },
});
