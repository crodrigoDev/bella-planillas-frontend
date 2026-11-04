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

## ConfirmModal

Modal de confirmación (anular, quitar, reactivar, aprobar...). Son dos piezas: `ConfirmModal`
es el cascarón (`AlertDialog`) y `ConfirmModalBody` pinta título, descripción, error y los
botones. El cuerpo va como hijo para que se desmonte al cerrar: la mutación que crea y el
error de un intento anterior se descartan solos, igual que en los demás modales.

`ConfirmModal`:

| Prop | Tipo | Notas |
| --- | --- | --- |
| `open`, `onOpenChange` | | Estado del modal |
| `children` | `ReactNode` | Un `ConfirmModalBody` |

`ConfirmModalBody`:

| Prop | Tipo | Notas |
| --- | --- | --- |
| `title`, `description` | `ReactNode` | |
| `confirmLabel` | `string` | Texto del botón principal |
| `cancelLabel` | `string?` | Por defecto "Cancelar" |
| `variant` | `"default" \| "destructive"?` | `"destructive"` para anular, quitar, dar de baja |
| `isPending` | `boolean?` | Bloquea los botones y muestra el spinner |
| `error` | `unknown?` | Se muestra con `ErrorAlert` |
| `onConfirm` | `() => void` | |

```tsx
<ConfirmModal open={open} onOpenChange={onOpenChange}>
  <AnularContratoContent contrato={contrato} onClose={() => onOpenChange(false)} />
</ConfirmModal>

// AnularContratoContent crea la mutación y devuelve:
<ConfirmModalBody
  title="Anular contrato"
  description="Se anulará el contrato y dejará de verse en la lista."
  confirmLabel="Anular"
  variant="destructive"
  isPending={mutation.isPending}
  error={mutation.error}
  onConfirm={handleConfirm}
/>
```

[`src/features/contratos/components/modals/AnularContratoModal.tsx`](../../src/features/contratos/components/modals/AnularContratoModal.tsx)

Sin mutación (por ejemplo `SalirRegistroModal`), se usa solo con `onConfirm`.

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
| `TONE_TEXT` | `Record<StatusTone, string>` | Color de un texto suelto (alto contraste) |
| `TONE_ICON` | `Record<StatusTone, string>` | Color de un icono |

```tsx
<span className={cn("size-3.5 rounded-full", TONE_DOT[estado.tone])} />
<p className={cn("text-sm", TONE_TEXT.danger)}>Venció hace {diasVencido} días</p>
```

[`src/features/contratos/components/ContratoItem.tsx`](../../src/features/contratos/components/ContratoItem.tsx)

Los colores sólidos (`bg-success`, `text-success`...) son para puntos, iconos, barras y
bordes. Para texto sobre fondo claro usa `TONE_TEXT` (`text-*-soft-foreground` o
`text-destructive`): los sólidos no llegan a 4,5:1 de contraste.

Las filas resaltadas usan el fondo suave del tono, por ejemplo `bg-destructive-soft/60`.
Las categorías sin significado de estado (círculos del historial) usan
`bg-category-1` a `bg-category-5` con `text-category-foreground`. Las features no escriben
colores de la paleta de Tailwind (`red-600`, `emerald-50`...).
