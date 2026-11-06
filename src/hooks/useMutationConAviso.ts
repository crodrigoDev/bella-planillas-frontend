import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface MutationConAvisoOptions<TData, TVars> {
  mutationFn: (vars: TVars) => Promise<TData>;
  /** Texto del aviso; puede depender de lo que se envió o de lo que respondió el backend */
  successMessage: string | ((data: TData, vars: TVars) => string);
  /** Consultas que se refrescan al terminar */
  invalidate: QueryKey[];
  /** Paso extra después del aviso y antes de refrescar, por ejemplo recalcular un resumen */
  afterSuccess?: (data: TData, vars: TVars) => Promise<void>;
}

/**
 * Mutación que, al terminar bien, avisa con un toast y refresca consultas de la caché
 *
 * @remarks
 * La mutación sigue pendiente hasta que termina el refresco: así un modal o una
 * página se cierra cuando la lista o la ficha ya muestran el cambio. Los errores
 * no se avisan aquí: los muestra quien usa la mutación con `ErrorAlert`.
 */
export function useMutationConAviso<TData, TVars = void>({
  mutationFn,
  successMessage,
  invalidate,
  afterSuccess,
}: MutationConAvisoOptions<TData, TVars>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async (data, vars) => {
      toast.success(
        typeof successMessage === "function"
          ? successMessage(data, vars)
          : successMessage,
      );
      await afterSuccess?.(data, vars);

      return Promise.all(
        invalidate.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
  });
}
