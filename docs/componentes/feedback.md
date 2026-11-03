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

## StatusBadge

Insignia de estado con el color de su tono. Los colores salen de los tokens del tema
(`success`, `warning`, `info`, `destructive`), así que no se escriben clases de color en
las features: se elige un tono y listo.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `tone` | `StatusTone` | `"success"` (en regla), `"warning"` (atención), `"danger"` (problema), `"info"` (informativo) o `"neutral"` |
| `children` | `ReactNode` | Texto de la insignia |
| `withDot` | `boolean?` | Punto de color antes del texto |
| `className` | `string?` | Para ajustes de tamaño o posición, no de color |

```tsx
<StatusBadge tone={ESTADO_CONTRATO[contrato.estado].tone}>
  {ESTADO_CONTRATO[contrato.estado].label}
</StatusBadge>
```

[`src/features/contratos/components/modals/RenovarContratoModal.tsx`](../../src/features/contratos/components/modals/RenovarContratoModal.tsx)

Cada feature guarda el nombre y el tono de sus estados en una sola tabla de su
`*.config.ts` (`ESTADO_CONTRATO`, `ESTADO_RESUMEN`, `ESTADO_DIA`, `ESTADO_LABORAL`), de la
forma `Record<Estado, { label: string; tone: StatusTone }>`. Para agregar un estado se
agrega una línea y TypeScript avisa si falta alguno.

### statusTone.config.ts

Define `StatusTone` y las clases de cada tono. Cambiar el aspecto de todas las insignias
es editar este archivo.

| Export | Tipo | Notas |
| --- | --- | --- |
| `StatusTone` | `"success" \| "warning" \| "danger" \| "info" \| "neutral"` | |
| `TONE_BADGE` | `Record<StatusTone, string>` | Fondo suave, borde y texto de la insignia |
| `TONE_DOT` | `Record<StatusTone, string>` | Fondo del punto de color |

```tsx
<span className={cn("size-3.5 rounded-full", TONE_DOT[estado.tone])} />
```

[`src/features/contratos/components/ContratoItem.tsx`](../../src/features/contratos/components/ContratoItem.tsx)

Los colores sólidos (`bg-success`, `text-success`...) son para puntos, iconos, barras y
bordes. Para texto sobre fondo claro usa `text-*-soft-foreground` o `text-destructive`:
los sólidos no llegan a 4,5:1 de contraste.
