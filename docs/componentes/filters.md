# components/filters/

[← Volver al índice](../README.md)

Piezas de la barra de filtros de un listado. El estado de los filtros vive en la URL
(ver `urlParams.utils.ts`).

## SearchInput

Campo de búsqueda que avisa con `onSearch` solo cuando se deja de escribir (espera
400 ms por defecto). Tiene su propio texto interno; si `value` cambia desde fuera
(botón atrás, limpiar filtros), el campo lo muestra y descarta la búsqueda pendiente.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `value` | `string` | Búsqueda vigente (la de la URL) |
| `onSearch` | `(value: string) => void` | Recibe el texto sin espacios en los extremos |
| `placeholder`, `ariaLabel` | `string` | |
| `debounceMs` | `number?` | Por defecto 400 |
| `className` | `string?` | Por defecto `w-full sm:w-72` |

```tsx
<SearchInput
  className="flex-1 sm:w-auto sm:min-w-72"
  value={filters.search ?? ""}
  onSearch={onSearchChange}
  placeholder="Buscar por nombre, documento o correo"
  ariaLabel="Buscar empleados"
/>
```

[`src/features/empleados/components/listado/EmpleadosToolbar.tsx`](../../src/features/empleados/components/listado/EmpleadosToolbar.tsx)

## FilterSelect

Selector de un filtro con una primera opción "todos" que lo quita (`onChange` recibe
`undefined`). Si el valor viene de la URL y no está en las opciones, muestra una
opción provisional. `SelectField` lo usa cuando recibe `clearLabel`.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `ariaLabel` | `string` | |
| `allLabel` | `string` | Texto de la opción que quita el filtro |
| `options` | `SelectOption[]` | |
| `value` | `string \| undefined` | `undefined` = todos |
| `onChange` | `(value: string \| undefined) => void` | |
| `isLoading` | `boolean?` | |
| `id` | `string?` | Para enlazar un `htmlFor` |
| `className` | `string?` | Por defecto `w-full sm:w-48` |

```tsx
<FilterSelect
  ariaLabel="Filtrar por área"
  allLabel="Todas las áreas"
  options={areas.data ?? NO_OPTIONS}
  value={filters.area_id}
  onChange={(value) => onFilterChange("area_id", value)}
  isLoading={areas.isLoading}
/>
```

[`src/features/empleados/components/listado/EmpleadosToolbar.tsx`](../../src/features/empleados/components/listado/EmpleadosToolbar.tsx)

## FilterChip

Etiqueta de un filtro aplicado, con botón para quitarlo.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `label` | `string` | Por ejemplo "Área: Operaciones" |
| `onRemove` | `() => void` | |

```tsx
<FilterChip
  key={key}
  label={label}
  onRemove={() => onFilterChange(key, undefined)}
/>
```

[`src/features/empleados/components/listado/EmpleadosToolbar.tsx`](../../src/features/empleados/components/listado/EmpleadosToolbar.tsx)

## filters.config.ts

Exporta `ACTIVO_FILTER_OPTIONS`: las opciones "Activo" / "Inactivo" del filtro de
estado. Sus valores (`"true"` / `"false"`) son el texto que viaja en la URL.

```tsx
<FilterSelect
  ariaLabel="Filtrar por estado"
  allLabel="Todos los estados"
  options={ACTIVO_FILTER_OPTIONS}
  value={filters.activo === undefined ? undefined : String(filters.activo)}
  onChange={(value) => onFilterChange("activo", value)}
/>
```

[`src/features/empleados/components/listado/EmpleadosToolbar.tsx`](../../src/features/empleados/components/listado/EmpleadosToolbar.tsx) (el `value` está reformateado en una línea)

