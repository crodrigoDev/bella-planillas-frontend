# components/data-table/

[← Volver al índice](../README.md)

## DataTable

Tabla genérica (TanStack Table) con paginación controlada por el servidor: filas de
carga, atenuado mientras llega otra página, mensaje vacío, selector de filas por
página y botones de página (con `getPageItems`). Las filas y columnas se desplazan
dentro de la caja de la tabla, como en Jira (cabecera fija con sombra al hacer scroll,
separadores entre columnas, scroll vertical y horizontal), y la paginación queda
siempre a la vista. El alto de la caja se ajusta a las filas y crece hasta el máximo que le deja su
contenedor; después hace scroll. En una página de listado, la `section` debe ser
`flex min-h-0 flex-1 flex-col` (el layout ya limita el alto); si el contenedor no tiene
alto definido, la tabla crece con su contenido. Las columnas se definen con
`createColumnHelper<DataTableFeatures, T>()`.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `columns` | `ColumnDef<DataTableFeatures, TData, any>[]` | |
| `data` | `TData[]` | Solo las filas de la página actual |
| `pagination` | `PaginationState` | `{ pageIndex, pageSize }` |
| `rowCount` | `number` | Total de filas en el servidor |
| `onPaginationChange` | `OnChangeFn<PaginationState>` | |
| `isLoading` | `boolean?` | Primera carga: filas de carga |
| `isFetching` | `boolean?` | Cargando otra página: atenúa y conserva los datos |
| `emptyMessage` | `string` | Mensaje cuando no hay filas |
| `itemLabel` | `string?` | Nombre de las filas en plural; por defecto "registros" |
| `pageSizeOptions` | `readonly number[]?` | Por defecto `PAGE_SIZE_OPTIONS` |

```tsx
<DataTable
  columns={empleadosColumns}
  data={data?.items ?? NO_EMPLEADOS}
  pagination={pagination}
  rowCount={data?.pagination.total ?? 0}
  onPaginationChange={handlePaginationChange}
  isLoading={isLoading}
  isFetching={isFetching}
  emptyMessage="No se encontraron empleados"
  itemLabel="colaboradores"
/>
```

[`src/pages/empleados/EmpleadosPage.tsx`](../../src/pages/empleados/EmpleadosPage.tsx). Las columnas se declaran así
([`src/features/empleados/config/empleados.columns.tsx`](../../src/features/empleados/config/empleados.columns.tsx)):

```tsx
const columnHelper = createColumnHelper<DataTableFeatures, Empleado>();
```

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

