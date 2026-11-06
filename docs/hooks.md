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
| `keepPrevious` | `boolean?` | Conserva la lista anterior mientras llega la nueva; para catálogos con búsqueda |

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

## useMutationConAviso

Mutación que, al terminar bien, muestra un toast de éxito y refresca consultas de la caché.
Es la base de los hooks `use*Actions` de cada feature: estos conservan su nombre y firma,
solo cambian `mutationFn`, el mensaje y las claves a invalidar. La mutación sigue
*pending* hasta que termina el refresco, así un modal o una página se cierra cuando la
lista ya muestra el cambio. Los errores no se avisan aquí: los muestra quien la usa con
`ErrorAlert`. No sirve para flujos de varios pasos con su propio estado
(`useCrearEmpleado`) ni para los formularios de acceso.

| Opción | Tipo | Notas |
| --- | --- | --- |
| `mutationFn` | `(vars) => Promise<data>` | Llama al servicio |
| `successMessage` | `string \| (data, vars) => string` | Texto del aviso; la función sirve cuando depende de lo enviado |
| `invalidate` | `QueryKey[]` | Consultas que se refrescan al terminar; usa las `*Key.all` de la feature |
| `afterSuccess` | `(data, vars) => Promise<void>?` | Paso extra tras el aviso y antes de refrescar |

```ts
export function useEditarContrato(id: string) {
  return useMutationConAviso({
    mutationFn: (dto: EditarContratoDto) => contratosService.editar(id, dto),
    successMessage: "El contrato se actualizó correctamente.",
    invalidate: [contratosKey.all],
  });
}
```

[`src/features/contratos/hooks/useContratoActions.ts`](../src/features/contratos/hooks/useContratoActions.ts)

Con un paso extra y otra feature por refrescar (`ROOT_KEYS` está en
[queryKeys.config.ts](lib.md#querykeysconfigts)):

```ts
useMutationConAviso({
  mutationFn: (dto: AsignarJornadaAsistenciaDto) => asistenciaService.asignarJornada(dto),
  successMessage: "La jornada se asignó correctamente.",
  afterSuccess: () => regenerarResumen(empleadoId, periodo),
  invalidate: [asistenciaKey.all, ROOT_KEYS.empleados],
})
```

[`src/features/asistencia/hooks/useAsistenciaActions.ts`](../src/features/asistencia/hooks/useAsistenciaActions.ts)

## usePaginacionLocal

Pagina en el navegador una lista que ya está completa en memoria, para pasarla a
`DataTable` sin pedir páginas al servidor. Muestra 20 filas por página. Devuelve
`{ pagination, onPaginationChange, pageItems, rowCount }`, que son las props de
`DataTable`.

| Parámetro | Tipo | Notas |
| --- | --- | --- |
| `items` | `readonly T[]` | Todas las filas |

```tsx
const { pagination, onPaginationChange, pageItems, rowCount } =
  usePaginacionLocal(revision.errores_detalle);

<DataTable
  columns={erroresFilaColumns}
  data={pageItems}
  pagination={pagination}
  rowCount={rowCount}
  onPaginationChange={onPaginationChange}
  emptyMessage="No hay errores"
  itemLabel="errores"
/>
```

[`src/features/empleados/components/importacion/ImportarRevisionPaso.tsx`](../src/features/empleados/components/importacion/ImportarRevisionPaso.tsx)

## use-mobile.ts

Exporta `useIsMobile()`. Es de shadcn y lo usa `components/ui/sidebar.tsx`; no está
pensado para usarlo desde las features.

