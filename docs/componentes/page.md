# components/page/

[← Volver al índice](../README.md)

## AccionButton

Botón de icono para una acción de una fila o tarjeta (editar, quitar, adjuntar…), con
su nombre en un tooltip y como `aria-label`.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `label` | `string` | Tooltip y `aria-label` |
| `icon` | `LucideIcon` | |
| `onClick` | `() => void` | |
| `tone` | `StatusTone?` | Color del icono: `"info"`, `"success"`, `"danger"`...; por defecto `"neutral"` (gris) |

```tsx
<AccionButton
  label="Editar"
  icon={PencilIcon}
  onClick={() => setOpenModal("editar")}
/>
<AccionButton
  label="Anular"
  icon={CircleXIcon}
  onClick={() => setOpenModal("anular")}
  tone="danger"
/>
```

[`src/features/contratos/components/ContratoItem.tsx`](../../src/features/contratos/components/ContratoItem.tsx)

## PageHeader

Encabezado de una página: `h1`, descripción y una acción opcional a la derecha.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `id` | `string` | Id del título, para el `aria-labelledby` de la sección |
| `title` | `string` | |
| `description` | `string?` | |
| `action` | `ReactNode?` | Por ejemplo el botón "Nuevo empleado" |

```tsx
<PageHeader
  id="nuevo-empleado-title"
  title="Nuevo empleado"
  description="Registra la información del colaborador en el sistema para dar de alta su legajo."
/>
```

[`src/pages/empleados/NuevoEmpleadoPage.tsx`](../../src/pages/empleados/NuevoEmpleadoPage.tsx) (con `action`: `EmpleadosPage.tsx`)

## PageTabs

Pestañas de una página donde cada una es una ruta (`NavLink`). La activa sale de la
URL y el subrayado se desliza hasta ella. Exporta el tipo `PageTab`.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `tabs` | `PageTab[]` | `{ to: string; label: string; end?: boolean }`. `end` = activa solo con la ruta exacta |
| `label` | `string` | Descripción de la navegación para lectores de pantalla |

```tsx
const getTabs = (id: string): PageTab[] => [
  { to: buildEmpleadoPath(id), label: "Información", end: true },
  { to: buildEmpleadoPath(id, "contratos"), label: "Contratos" },
  // ...
];

<PageTabs label="Secciones de la ficha" tabs={getTabs(empleado.id)} />
```

[`src/pages/empleados/EmpleadoDetalleLayout.tsx`](../../src/pages/empleados/EmpleadoDetalleLayout.tsx)

