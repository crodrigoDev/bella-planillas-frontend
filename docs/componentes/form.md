# components/form/

[← Volver al índice](../README.md)

Piezas para formularios con `react-hook-form`. Los campos (`FormField`, `TextField`,
`SelectField`) se usan dentro de un `<FormProvider {...methods}>`.

## FormField

Etiqueta, marca de obligatorio, control y mensaje de error de un campo. Se suscribe a
su propio error con `useFormState`. Úsalo para controles propios (por ejemplo un
`Textarea`); para texto y selectores ya existen `TextField` y `SelectField`.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `name` | `string` | Nombre del campo; también es su `id` |
| `label` | `string` | |
| `required` | `boolean?` | Muestra `RequiredMark` |
| `description` | `string?` | Ayuda bajo el control |
| `className` | `string?` | Para ocupar más columnas de la cuadrícula |
| `labelClassName` | `string?` | Clases de la etiqueta (los formularios de acceso usan `text-xs`) |
| `labelAside` | `ReactNode?` | Elemento a la derecha de la etiqueta: un enlace, "Requerido"... |
| `children` | `(invalid: boolean) => ReactNode` | Recibe si hay error, para `aria-invalid` |

```tsx
<FormField name={name} label={label} required className="col-span-full">
  {(invalid) => (
    <Textarea
      id={name}
      maxLength={1000}
      placeholder={placeholder}
      aria-invalid={invalid}
      {...register(name)}
    />
  )}
</FormField>
```

[`src/features/asistencia/components/MotivoField.tsx`](../../src/features/asistencia/components/MotivoField.tsx)

## TextField

Campo de texto (también fecha, hora, correo, número…) enlazado al formulario. Acepta
las props de `<input>` excepto `name`, `id` y `required`, que se declaran aparte.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `name` | `string` | |
| `label` | `string` | |
| `required` | `boolean?` | Solo marca el asterisco; la validación la hace el esquema |
| `optional` | `boolean?` | Si está vacío envía `undefined` en vez de `""` |
| `description` | `string?` | |
| `fieldClassName` | `string?` | Clases de la cuadrícula para el campo completo |
| `labelClassName`, `labelAside` | | Igual que en `FormField` |

```tsx
<TextField
  name="fecha"
  label="Fecha"
  required
  type="date"
  min={rango.inicio}
  max={maxFecha}
/>
```

[`src/features/asistencia/components/modals/MarcacionManualModal.tsx`](../../src/features/asistencia/components/modals/MarcacionManualModal.tsx)

## SelectField

Selector de opciones enlazado al formulario. Es obligatorio por defecto; con
`clearLabel` pasa a ser opcional y guarda `null` al vaciarlo (no `undefined`, porque
`react-hook-form` volvería a mostrar el valor inicial).

| Prop | Tipo | Notas |
| --- | --- | --- |
| `name`, `label` | `string` | |
| `required` | `boolean?` | |
| `options` | `SelectOption[]?` | Mientras no lleguen, el selector queda vacío |
| `placeholder` | `string?` | Por defecto "Selecciona una opción" |
| `isLoading` | `boolean?` | Muestra "Cargando..." |
| `description` | `string?` | |
| `fieldClassName` | `string?` | |
| `clearLabel` | `string?` | Vuelve el campo opcional; es el texto de la opción vacía |
| `onValueChange` | `(value: string \| undefined) => void` | Después de guardar el valor |

```tsx
<SelectField
  name="tipo_marcacion"
  label="Tipo de marcación"
  required
  options={TIPO_MARCA_OPTIONS}
  placeholder="Selecciona un tipo"
  fieldClassName="col-span-full"
/>
```

[`src/features/asistencia/components/modals/MarcacionManualModal.tsx`](../../src/features/asistencia/components/modals/MarcacionManualModal.tsx)

## OptionSelect

Selector de una opción obligatoria (sin opción para quitar la selección). Es lo que
usa `SelectField` por dentro; úsalo directo solo si el control no va en un formulario
de `react-hook-form`. Si el valor no está entre las opciones (porque aún cargan),
agrega una opción provisional.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `id` | `string` | |
| `options` | `SelectOption[]` | |
| `value` | `string \| undefined` | `undefined` = sin elegir |
| `onChange` | `(value: string) => void` | |
| `placeholder` | `string` | |
| `isLoading`, `invalid`, `disabled` | `boolean?` | |

```tsx
<OptionSelect
  id={name}
  options={options}
  value={field.value || undefined}
  onChange={handleChange}
  placeholder={placeholder}
  isLoading={isLoading}
  invalid={invalid}
/>
```

[`src/components/form/SelectField.tsx`](../../src/components/form/SelectField.tsx) (hoy es su único uso)

## FormSection

Bloque de un formulario: título y descripción a la izquierda, campos a la derecha
(1, 2 o 3 columnas según el ancho). Las secciones se separan con una línea, sin
tarjetas ni iconos. Un campo ancho usa `sm:col-span-2` o `col-span-full`.

| Prop | Tipo |
| --- | --- |
| `title` | `string` |
| `description` | `string` |
| `children` | `ReactNode` |

```tsx
<FormSection
  title="Previsión social y régimen de pensiones"
  description="Afiliación al Sistema Privado de Pensiones (AFP) o al Sistema Nacional de Pensiones (ONP)."
>
  {/* SelectField, TextField... (resumido) */}
</FormSection>
```

[`src/features/datosFinancieros/components/DatosFinancierosCampos.tsx`](../../src/features/datosFinancieros/components/DatosFinancierosCampos.tsx)

## RequiredMark

Asterisco rojo que marca un campo obligatorio. Sin props. `FormField` ya lo incluye;
solo se usa a mano en controles que no pasan por `FormField` (radios, checkboxes).

```tsx
Sexo <RequiredMark />
```

[`src/features/empleados/components/registro/DatosEmpleadoCampos.tsx`](../../src/features/empleados/components/registro/DatosEmpleadoCampos.tsx)

## LoadingButton

Botón que se bloquea y muestra un spinner mientras espera una petición. Acepta las
props de `Button`.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `isLoading` | `boolean` | Bloquea el botón y muestra el spinner |
| `loadingText` | `string?` | Reemplaza al texto mientras espera; si falta, se mantiene el texto |
| `icon` | `LucideIcon?` | Icono al final, solo cuando no está esperando |

```tsx
<LoadingButton
  variant="outline"
  isLoading={generar.isPending}
  loadingText="Actualizando…"
  icon={RefreshCwIcon}
  onClick={() => generar.mutate()}
>
  Actualizar resumen
</LoadingButton>
```

[`src/features/asistencia/components/AsistenciaEmpleado.tsx`](../../src/features/asistencia/components/AsistenciaEmpleado.tsx)

## ModalFormFooter

Pie de un formulario en un modal: botón "Cancelar" (cierra el modal) y botón de envío con
spinner. Va dentro del `<form>`, junto a un `ErrorAlert` justo arriba.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `isPending` | `boolean` | Bloquea los botones y muestra la espera |
| `submitLabel` | `string` | Texto del botón de envío |
| `loadingText` | `string?` | Por defecto "Guardando…" |
| `variant` | `"default" \| "destructive"?` | `"destructive"` para acciones como dar de baja |
| `disabled` | `boolean?` | Bloquea el envío, por ejemplo si falta un dato |
| `cancelLabel` | `string?` | Por defecto "Cancelar" |

```tsx
<ErrorAlert error={mutation.error} />

<ModalFormFooter
  isPending={mutation.isPending}
  submitLabel="Registrar contrato"
/>
```

[`src/features/contratos/components/modals/NuevoContratoModal.tsx`](../../src/features/contratos/components/modals/NuevoContratoModal.tsx)

## FileDropzone

Zona para elegir un archivo con un clic o arrastrándolo. Solo guarda el archivo: quien
la usa valida tipo y tamaño.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `id` | `string` | Para enlazar el `FieldLabel` |
| `file` | `File \| null` | Archivo elegido |
| `onChange` | `(file: File \| null) => void` | |
| `accept` | `string?` | Por ejemplo `"application/pdf"` |
| `hint` | `string?` | Texto pequeño bajo la invitación |
| `invalid`, `disabled` | `boolean?` | |

```tsx
<FileDropzone
  id="contrato-pdf"
  file={file}
  onChange={setFile}
  accept="application/pdf"
  hint="Únicamente archivos PDF"
  invalid={Boolean(archivoError)}
  disabled={mutation.isPending}
/>
```

[`src/features/contratos/components/modals/SubirPdfModal.tsx`](../../src/features/contratos/components/modals/SubirPdfModal.tsx)

## ColaboradorSelect

Selector de colaborador con búsqueda en el servidor, sin react-hook-form (sirve de filtro
suelto). No filtra en el navegador: avisa el texto escrito (con espera de 400 ms) y muestra
lo que se le pasa en `options`. El elegido no desaparece de la lista aunque la búsqueda
siguiente no lo incluya. Quien lo usa trae las opciones (la página las pide a `empleados`,
porque una feature no importa de otra).

| Prop | Tipo | Notas |
| --- | --- | --- |
| `value` | `string \| undefined` | Id del colaborador elegido |
| `onChange` | `(value: string \| undefined) => void` | `undefined` al vaciar |
| `options` | `ColaboradorOption[]` | `{ value, label, nro_documento }` (`lib/types/options.types.ts`) |
| `onSearchChange` | `(search: string) => void` | Texto escrito, ya con espera |
| `isLoading` | `boolean?` | Cambia el mensaje de "sin resultados" |
| `selectedLabel` | `string?` | Nombre del elegido si no está en `options` (el id viene de la URL) |
| `placeholder`, `id`, `ariaLabel`, `invalid`, `className` | | |

```tsx
<ColaboradorSelect
  value={filters.empleado_id}
  onChange={(value) => onFilterChange("empleado_id", value)}
  options={empleados}
  isLoading={empleadosLoading}
  onSearchChange={onEmpleadoSearchChange}
  selectedLabel={colaboradorNombre}
/>
```

[`src/features/asistencia/components/marcaciones/MarcacionesToolbar.tsx`](../../src/features/asistencia/components/marcaciones/MarcacionesToolbar.tsx)

## ColaboradorCombobox

`ColaboradorSelect` enlazado a un formulario: envuelve el selector con `FormField` y
`Controller` y guarda solo el id (al vaciar guarda `""`, para que el esquema avise). Debe
usarse dentro de un `FormProvider`.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `name` | `string` | Campo del formulario |
| `label` | `string` | |
| `required` | `boolean?` | |
| `options`, `isLoading`, `onSearchChange`, `placeholder` | | Igual que `ColaboradorSelect` |
| `fieldClassName` | `string?` | |

```tsx
<ColaboradorCombobox
  name="empleado_id"
  label="Colaborador"
  required
  options={empleados}
  isLoading={empleadosLoading}
  onSearchChange={onSearchChange}
/>
```

[`src/features/asistencia/components/marcaciones/RegistrarMarcacionModal.tsx`](../../src/features/asistencia/components/marcaciones/RegistrarMarcacionModal.tsx)

## ResumenCampo

Un dato de solo lectura: su nombre y su valor. Va dentro de una `FormSection`.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `label` | `string` | |
| `value` | `string` | Usa `orDash`, `formatDate`… antes de pasarlo |
| `className` | `string?` | Clases de la cuadrícula |

```tsx
<ResumenCampo label="AFP administradora" value={data.afp_nombre} />
<ResumenCampo label="CUSPP" value={maskEnd(data.cuspp, 3)} />
```

[`src/features/datosFinancieros/components/DatosFinancierosEmpleado.tsx`](../../src/features/datosFinancieros/components/DatosFinancierosEmpleado.tsx)

