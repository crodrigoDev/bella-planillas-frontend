# lib/

[← Volver al índice](README.md)

Infraestructura transversal y utilidades puras. `lib/api` no importa de `features/`.

## format.utils.ts

Formato para mostrar datos. Ninguna función modifica el dato original.

| Función | Qué hace |
| --- | --- |
| `formatDate(isoDate)` | `dd/MM/yyyy`; `--` si no hay fecha. No usa `Date` (evita el desfase de zona horaria) |
| `orDash(value)` | El texto, o `--` si no existe o está vacío |
| `toTitleCase(name)` | `"MARÍA DE LOS ÁNGELES"` → `"María de los Ángeles"` |
| `formatCurrency(amount)` | Soles: `S/ 1,500.00`; `--` si no hay monto |
| `maskEnd(value, visible = 4)` | `•••• 1234`; `--` si no hay dato |

```tsx
<ResumenCampo label="Entidad EPS" value={orDash(data.eps_nombre)} />
```

[`src/features/datosFinancieros/components/DatosFinancierosEmpleado.tsx`](../src/features/datosFinancieros/components/DatosFinancierosEmpleado.tsx). Otros usos:
`formatDate(contrato.fecha_inicio)` en `ContratoItem.tsx`,
`formatCurrency(data.sueldo_basico)` en `DatosFinancierosEmpleado.tsx`,
`toTitleCase(nombre_completo)` en `empleados.utils.ts`.

## date.utils.ts

Fechas como texto `YYYY-MM-DD`, seguras frente a la zona horaria.

| Función | Qué hace |
| --- | --- |
| `getTodayIsoDate()` | Hoy en la zona del navegador (no usa `toISOString()`, que da el día siguiente en Perú después de las 19:00) |
| `parseIsoDate(iso)` | Texto `YYYY-MM-DD` a fecha local, sin pasar por UTC; `undefined` si no hay texto |
| `toIsoDate(date)` | Fecha local a `YYYY-MM-DD`, sin pasar por UTC |
| `toDateInput(isoDate)` | Recorta a `YYYY-MM-DD` para `<input type="date">`; `""` si no hay fecha |
| `getAge(birthIsoDate, referenceIsoDate = hoy)` | Años cumplidos; negativo si la fecha es futura |
| `formatFechaHoraLima(iso)` | Instante completo con zona a `dd/MM/yyyy, HH:mm` en hora de Lima |

```ts
const esFechaPasada = Boolean(desde) && desde < getTodayIsoDate();
```

[`src/features/asistencia/components/modals/AsignarJornadaModal.tsx`](../src/features/asistencia/components/modals/AsignarJornadaModal.tsx). Otros usos:
`toDateInput(contrato.fecha_inicio)` en `EditarContratoModal.tsx`,
`getAge(nacimiento)` en `DerechohabienteItem.tsx`.

## catalogos.utils.ts

Convierte catálogos del backend en opciones de `Select`. El tipo `SelectOption`
(`{ value: string; label: string }`) está en `lib/types/options.types.ts`.

| Export | Qué hace |
| --- | --- |
| `CATALOGO_LIMIT` | `100`, el máximo de registros por página del backend |
| `toOptions(items)` | `{ id, nombre }[]` → `SelectOption[]` |
| `getOptionLabel(options, value)` | Texto de una opción; el mismo valor si no está; `--` si no hay valor |

```ts
listAreas: async (): Promise<SelectOption[]> => {
  const response = await protectedHttpClient.get<
    PaginationApiResponse<EmpleadoRelacion>
  >("/rrhh/area", { params: { limit: CATALOGO_LIMIT, activo: true } });

  return toOptions(response.data.data);
},
```

[`src/features/empleados/services/catalogos.service.ts`](../src/features/empleados/services/catalogos.service.ts). Etiqueta de una opción:
`getOptionLabel(modalidades.data, contrato.tipo_modalidad)` en `ContratoItem.tsx`.

## pagination.utils.ts

`getPageItems(currentPage, totalPages, siblings = 1)` calcula qué botones de página
mostrar (`[1, 2, 3, "ellipsis", 7]`). Siempre incluye la primera y la última, y la
cantidad de elementos no cambia al pasar de página. Exporta el tipo `PageItem`. Lo usa
`DataTable`.

```tsx
{getPageItems(pageIndex + 1, pageCount).map((item, index) =>
  item === "ellipsis" ? (/* ... */) : (/* ... */),
)}
```

[`src/components/data-table/DataTable.tsx`](../src/components/data-table/DataTable.tsx) (resumido)

## urlParams.utils.ts

Lee los filtros de la URL con validación y arma los cambios de parámetros. La URL es
la fuente de verdad de un listado, así sobreviven al F5 y se pueden compartir.

| Función | Qué hace |
| --- | --- |
| `parsePage(value)` | Número de página; `1` si no es un entero positivo |
| `parseLimit(value, allowed, fallback)` | Filas por página si está entre las permitidas; si no, `fallback` |
| `parseUuid(value)` | El uuid, o `undefined` si no es válido |
| `parseBoolean(value)` | `true` / `false`, o `undefined` (sin filtro) |
| `applyParamChanges(current, changes)` | Copia de los parámetros con los cambios; un valor `undefined` quita el parámetro. El tipo de `changes` es `ParamChanges` |

```ts
page: parsePage(searchParams.get("page")),
area_id: parseUuid(searchParams.get("area_id")),
activo: parseBoolean(searchParams.get("activo")),
```

[`src/hooks/usePaginacionUrl.ts`](../src/hooks/usePaginacionUrl.ts) (lee `page` y cambia la URL con
`setSearchParams((current) => applyParamChanges(current, changes), { replace })`) y
[`src/features/empleados/hooks/useEmpleadosFilters.ts`](../src/features/empleados/hooks/useEmpleadosFilters.ts) (`area_id`, `activo`).

## archivo.utils.ts

Revisa un archivo antes de enviarlo, con las mismas reglas que el backend. El mensaje de
tamaño sale de los bytes, así no se escribe "5 MB" a mano.

| Export | Qué hace |
| --- | --- |
| `getArchivoError(file, reglas)` | Mensaje de error, o `null` si no hay archivo o cumple |
| `formatBytes(bytes)` | `"5 MB"`, `"512 KB"`; sirve también para las ayudas de `FileDropzone` |
| `ReglasArchivo` | Tipo de las reglas (abajo) |

| Regla | Tipo | Notas |
| --- | --- | --- |
| `tipos` | `readonly string[]?` | Tipos MIME permitidos (`file.type`) |
| `extensiones` | `readonly string[]?` | Con punto (`".xlsx"`). Si hay `tipos` y `extensiones`, basta cumplir uno |
| `maxBytes` | `number` | Tamaño máximo |
| `descripcionTipo` | `string` | Completa "El archivo debe ser …" (ej. `"un PDF"`) |
| `nombre` | `string?` | Sujeto del mensaje de tamaño; por defecto `"El archivo"` |

```ts
const REGLAS_ARCHIVO: ReglasArchivo = {
  extensiones: [MARCACIONES_EXTENSION],
  maxBytes: MARCACIONES_MAX_BYTES,
  descripcionTipo: "de Excel (.xlsx)",
};

const archivoError = getArchivoError(file, REGLAS_ARCHIVO);
```

[`src/features/asistencia/components/importacion/ImportarMarcacionesArchivoPaso.tsx`](../src/features/asistencia/components/importacion/ImportarMarcacionesArchivoPaso.tsx)

## zodMessages.utils.ts

Mensajes en español para los esquemas de `@jyp/shared-contracts` (zod 3).
`zodEsErrorMap` traduce los mensajes por defecto y deja los que el contrato ya escribió.
Cubre campos vacíos, textos largos o cortos, números fuera de rango y listas sin elegir.
`zodResolverOptions` es lo que se pasa siempre a `zodResolver`.

```ts
const resolver = zodResolver(MarcacionManualFormSchema, zodResolverOptions);

type MarcacionValues = Parameters<typeof resolver>[0];
```

[`src/features/asistencia/components/modals/MarcacionManualModal.tsx`](../src/features/asistencia/components/modals/MarcacionManualModal.tsx)

## personas.config.ts

Opciones de `Select` con los valores que acepta el contrato: `SEXO_OPTIONS` y
`ESTADO_CIVIL_OPTIONS`.

```tsx
value={getOptionLabel(SEXO_OPTIONS, empleado.sexo)}
```

[`src/features/empleados/components/detalle/EmpleadoDetalleDatos.tsx`](../src/features/empleados/components/detalle/EmpleadoDetalleDatos.tsx). Como opciones de
un selector: `options={SEXO_OPTIONS}` en `DerechohabienteCampos.tsx`.

## queryKeys.config.ts

`ROOT_KEYS`: las raíces de caché que más de una feature necesita invalidar
(`empleados`, `catalogos`). Una feature no importa de otra, así que estas claves viven
aquí y no se escriben como texto en cada uso. Cada feature arma sus claves completas desde
su raíz (`empleadosKey.all = ROOT_KEYS.empleados`).

| Clave | Valor | La usan |
| --- | --- | --- |
| `ROOT_KEYS.empleados` | `["empleados"]` | `empleadosKey`; asistencia y derechohabientes la invalidan |
| `ROOT_KEYS.catalogos` | `["catalogos"]` | `useCatalogo` |

```ts
invalidate: [derechohabientesKey.all, ROOT_KEYS.empleados],
```

[`src/features/derechohabientes/hooks/useDerechohabienteActions.ts`](../src/features/derechohabientes/hooks/useDerechohabienteActions.ts)

## apiError.utils.ts

`getApiErrorMessage(error: unknown): string` convierte un error de axios en un mensaje
para el usuario (sin conexión, tiempo agotado, error 5xx, o el `detail` del backend).
Si no reconoce el error, devuelve un mensaje genérico. Para mostrar un error en pantalla
usa `ErrorAlert`; esta función es para cuando se necesita el texto suelto.

```tsx
{getApiErrorMessage(loginMutation.error)}
```

[`src/pages/auth/LoginPage.tsx`](../src/pages/auth/LoginPage.tsx)

## Clientes HTTP

`lib/api/publicHttpClient.ts` y `lib/api/protectedHttpClient.ts`. Ambos usan
`VITE_API_URL` (el público lanza un error al cargar si falta).

| Export | Cuándo usarlo |
| --- | --- |
| `publicHttpClient` | Login, refresh y recuperación de contraseña (sin token) |
| `protectedHttpClient` | Todas las demás llamadas. Agrega el token y, ante un 401, renueva la sesión y reintenta una vez |
| `configureAuth(handlers)` | Lo llama el store de auth una sola vez para conectar el cliente con la sesión; no se usa en otro lugar |

Los tipos de las respuestas están en `lib/api/types/api.types.ts`: `ApiResponse<T>`,
`PaginationApiResponse<T>`, `ApiMeta` y `PaginationMeta`.

```ts
const response = await publicHttpClient.post<ApiResponse<LoginResponse>>(
  "/auth/login",
  credentials,
);

return response.data.data;
```

[`src/features/auth/services/auth.service.ts`](../src/features/auth/services/auth.service.ts)

## utils.ts

Exporta `cn`, que une clases de Tailwind y resuelve conflictos. Es un reexport del
paquete `cn`.

```tsx
className={cn(action && "flex items-center justify-between gap-2")}
```

[`src/components/feedback/ErrorAlert.tsx`](../src/components/feedback/ErrorAlert.tsx)
