import { useCallback, useEffect, useRef } from "react";

/**
 * Retrasa la ejecución de una función hasta que se deja de llamar por un tiempo
 *
 * @param callback - Función que se ejecuta al terminar la espera
 * @param delay - Milisegundos de espera desde la ultima llamada
 * @returns `run` para pedir la ejecución y `cancel` para descartar la pendiente
 *
 * @remarks
 * Si el componente se desmonta con una ejecución pendiente, esta se descarta
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Guardar siempre la última versión para no ejecutar una función vieja
  useEffect(() => {
    callbackRef.current = callback;
  });

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  const run = useCallback(
    (...args: Args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );

  useEffect(() => cancel, [cancel]);

  return {
    run,
    cancel,
  };
}
