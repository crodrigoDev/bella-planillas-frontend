# hooks/

[← Volver al índice](README.md)

Hooks que usa más de una feature.

## useCatalogo

Consulta un catálogo (lista de opciones de un `Select`) con TanStack Query. La clave
de caché siempre es `["catalogos", ...key]` y se reutiliza 30 minutos. Cada feature
lo envuelve en su `useCatalogos.ts`.

| Parámetro | Tipo | Notas |
| --- | --- | --- |
| `key` | `readonly unknown[]` | Va después de `"catalogos"` |
| `queryFn` | `() => Promise<T>` | Llama al servicio |
| `staleTime` | `number?` | Por defecto 30 minutos |

```ts
export function useModalidadesContrato() {
  return useCatalogo(["modalidades-contrato"], () =>
    contratosCatalogosService.listModalidades(),
  );
}
```

[`src/features/contratos/hooks/useCatalogos.ts`](../src/features/contratos/hooks/useCatalogos.ts)

## useDebouncedCallback

Retrasa una función hasta que pasa un tiempo sin que se la llame. Devuelve
`{ run, cancel }`; si el componente se desmonta, la ejecución pendiente se descarta.

| Parámetro | Tipo | Notas |
| --- | --- | --- |
| `callback` | `(...args) => void` | Se ejecuta al terminar la espera; siempre usa su última versión |
| `delay` | `number` | Milisegundos desde la última llamada |

```tsx
const { run: sendSearch, cancel: cancelSearch } = useDebouncedCallback(
  (next: string) => {
    setSentValue(next);
    onSearch(next);
  },
  debounceMs,
);
```

[`src/components/filters/SearchInput.tsx`](../src/components/filters/SearchInput.tsx)

## use-mobile.ts

Exporta `useIsMobile()`. Es de shadcn y lo usa `components/ui/sidebar.tsx`; no está
pensado para usarlo desde las features.

