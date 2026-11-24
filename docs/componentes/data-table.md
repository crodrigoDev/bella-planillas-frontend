# components/data-table/

[← Volver al índice](../README.md)

## DataTable

Tabla genérica (TanStack Table) con paginación (del servidor, o en el navegador
cortando la lista con [usePaginacionLocal](../hooks.md#usepaginacionlocal)) o sin
paginación para listas cortas: filas de carga, atenuado mientras llega otra página,
mensaje vacío, selector de filas por página y paginación con botones reales (`Button`
dentro de `Pagination`; los números salen de `getPageItems`; la página actual lleva
`aria-current="page"` y los botones se deshabilitan con `disabled`). Las filas y
columnas se desplazan dentro de la caja de la tabla, como en Jira (cabecera fija con
sombra al hacer scroll, separadores entre columnas, scroll vertical y horizontal), y la
paginación queda siempre a la vista. El alto de la caja se ajusta a las filas y crece
hasta el máximo que le deja su contenedor; después hace scroll. En una página de listado,
la `section` debe ser `flex min-h-0 flex-1 flex-col` (el layout ya limita el alto); si
el contenedor no tiene alto definido, la tabla crece con su contenido. Las columnas se
definen con `createColumnHelper<DataTableFeatures, T>()`.

`pagination`, `rowCount` y `onPaginationChange` van juntos: o se pasan los tres, o no se
pasa ninguno (modo sin paginación, sin pie de página).

| Prop | Tipo | Notas |
| --- | --- | --- |
| `columns` | `ColumnDef<DataTableFeatures, TData, any>[]` | |
| `data` | `readonly TData[]` | Filas de la página actual, o toda la lista sin paginación |
| `pagination` | `PaginationState?` | `{ pageIndex, pageSize }`; obligatorio si se pagina |
| `rowCount` | `number?` | Total de filas; obligatorio si se pagina |
| `onPaginationChange` | `OnChangeFn<PaginationState>?` | Obligatorio si se pagina |
| `isLoading` | `boolean?` | Primera carga: filas de carga |
| `isFetching` | `boolean?` | Cargando otra página: atenúa y conserva los datos |
| `emptyMessage` | `string` | Mensaje cuando no hay filas |
| `itemLabel` | `string?` | Nombre de las filas en plural; por defecto "registros" (solo con paginación) |
| `pageSizeOptions` | `readonly number[]?` | Por defecto `PAGE_SIZE_OPTIONS` (solo con paginación) |

```tsx
<DataTable
  columns={empleadosColumns}
  data={data?.items ?? NO_EMPLEADOS}
  pagination={pagination}
  rowCount={data?.pagination.total ?? 0}
  onPaginationChange={onPaginationChange}
  isLoading={isLoading}
  isFetching={isFetching}
  emptyMessage="No se encontraron empleados"
  itemLabel="colaboradores"
/>
```

[`src/pages/empleados/EmpleadosPage.tsx`](../../src/pages/empleados/EmpleadosPage.tsx). `pagination` y `onPaginationChange` salen de
[usePaginacionServidor](../hooks.md#usepaginacionservidor) (o de [usePaginacionLocal](../hooks.md#usepaginacionlocal)). Las columnas se declaran así
([`src/features/empleados/config/empleados.columns.tsx`](../../src/features/empleados/config/empleados.columns.tsx)):

```tsx
const columnHelper = createColumnHelper<DataTableFeatures, Empleado>();
```

### Sin paginación (listas cortas)

Usa `DataTable` sin `pagination`, `rowCount` ni `onPaginationChange` cuando la lista
completa es corta y vive dentro de otra pantalla (una pestaña de detalle o una sección):
muestra todas las filas en el orden recibido y omite el pie de paginación.

```tsx
<DataTable
  columns={columns}
  data={novedades}
  emptyMessage="Sin novedades en este mes"
/>
```

[`src/features/novedades/components/NovedadesTabla.tsx`](../../src/features/novedades/components/NovedadesTabla.tsx)

## dataTable.config.ts

Exporta `dataTableFeatures` (las funciones de TanStack Table que usan todas las
tablas), su tipo `DataTableFeatures` y `PAGE_SIZE_OPTIONS = [20, 50, 100]` (el backend
acepta hasta 100 filas por página).

```ts
limit: parseLimit(
  searchParams.get("limit"),
  PAGE_SIZE_OPTIONS,
  DEFAULT_LIMIT,
),
```

[`src/features/empleados/hooks/useEmpleadosFilters.ts`](../../src/features/empleados/hooks/useEmpleadosFilters.ts)

