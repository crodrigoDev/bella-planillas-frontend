# components/feedback/

[← Volver al índice](../README.md)

## ErrorAlert

Alerta roja con el mensaje de un error de petición (sale de `getApiErrorMessage`). No
muestra nada si `error` es `null`, así que no hace falta un `isError &&` alrededor.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `error` | `unknown` | Error de la consulta o mutación |
| `title` | `string?` | |
| `children` | `ReactNode?` | Texto que se agrega tras el mensaje |
| `action` | `ReactNode?` | Elemento a la derecha, por ejemplo "Reintentar" |

```tsx
<ErrorAlert error={logoutMutation.error} title="No se pudo cerrar sesión" />
```

[`src/app/layouts/AppLayout.tsx`](../../src/app/layouts/AppLayout.tsx)

Con botón de reintento:

```tsx
<ErrorAlert
  error={error}
  title="No se pudo cargar la lista de empleados"
  action={
    <Button variant="outline" size="sm" onClick={() => refetch()}>
      Reintentar
    </Button>
  }
/>
```

[`src/pages/empleados/EmpleadosPage.tsx`](../../src/pages/empleados/EmpleadosPage.tsx)

## DetalleTabEstado

Resuelve lo que se ve en una pestaña de la ficha: esqueleto mientras carga,
`ErrorAlert` con "Reintentar" si falla, estado vacío si no hay datos, o los hijos.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `isLoading` | `boolean` | |
| `error` | `unknown` | |
| `onRetry` | `() => void` | |
| `isEmpty` | `boolean` | |
| `emptyTitle`, `emptyDescription` | `string` | |
| `children` | `ReactNode` | |

```tsx
<DetalleTabEstado
  isLoading={isLoading}
  error={error}
  onRetry={() => refetch()}
  isEmpty={!data?.length}
  emptyTitle="Sin contratos"
  emptyDescription="Este empleado todavía no tiene contratos registrados."
>
  {/* contenido (resumido) */}
</DetalleTabEstado>
```

[`src/features/contratos/components/ContratosEmpleado.tsx`](../../src/features/contratos/components/ContratosEmpleado.tsx)

