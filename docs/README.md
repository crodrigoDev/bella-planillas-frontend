# Catálogo de lo reutilizable

Lo que ya existe y se debe reutilizar **antes de escribir algo nuevo**. Cada pieza
tiene para qué sirve, sus props o firma principal y un ejemplo tomado de un uso real,
con el archivo al que se puede saltar. Para el detalle completo, abre el archivo de
código: todos tienen TSDoc.

[← Volver al README del proyecto](../README.md)

## Reglas

- **`src/components/ui/` no se edita.** Son las piezas de shadcn/ui. Si hace falta otro
  comportamiento, se compone desde `src/components/<área>/`.
- **Un componente compartido va en `src/components/<área>/` cuando el patrón se repite
  3 veces o más.** Mientras se use en una sola feature, vive en esa feature.
- **Si agregas o cambias una pieza compartida, actualiza su documento en el mismo
  commit.**
- **Los colores salen de los tokens del tema** (`success`, `warning`, `info`,
  `destructive`, `category-N`, `muted`...), nunca de la paleta de Tailwind (`red-600`,
  `emerald-50`, `bg-white`...). ESLint lo impide fuera de `src/components/ui/`. Para estados
  usa [StatusBadge](componentes/feedback.md#statusbadge).

### Cómo documentar una pieza nueva

Cada pieza es una subsección `##` de su archivo, con este formato:

1. Una línea de para qué sirve.
2. Tabla de props o de la firma (`Prop | Tipo | Notas`).
3. Un ejemplo real de 3 a 8 líneas, con la ruta del archivo de donde sale.

## Índice

### Componentes

| Archivo | Piezas |
| --- | --- |
| [componentes/form.md](componentes/form.md) | [FormField](componentes/form.md#formfield) · [TextField](componentes/form.md#textfield) · [SelectField](componentes/form.md#selectfield) · [OptionSelect](componentes/form.md#optionselect) · [FormSection](componentes/form.md#formsection) · [RequiredMark](componentes/form.md#requiredmark) · [LoadingButton](componentes/form.md#loadingbutton) · [ModalFormFooter](componentes/form.md#modalformfooter) · [FileDropzone](componentes/form.md#filedropzone) · [ResumenCampo](componentes/form.md#resumencampo) |
| [componentes/feedback.md](componentes/feedback.md) | [ErrorAlert](componentes/feedback.md#erroralert) · [DetalleTabEstado](componentes/feedback.md#detalletabestado) · [EmptyState](componentes/feedback.md#emptystate) · [ConfirmModal](componentes/feedback.md#confirmmodal) · [StatusBadge](componentes/feedback.md#statusbadge) · [statusTone.config.ts](componentes/feedback.md#statustoneconfigts) |
| [componentes/page.md](componentes/page.md) | [AccionButton](componentes/page.md#accionbutton) · [PageHeader](componentes/page.md#pageheader) · [PageTabs](componentes/page.md#pagetabs) |
| [componentes/filters.md](componentes/filters.md) | [SearchInput](componentes/filters.md#searchinput) · [FilterSelect](componentes/filters.md#filterselect) · [DateRangeFilter](componentes/filters.md#daterangefilter) · [FilterChip](componentes/filters.md#filterchip) · [filters.config.ts](componentes/filters.md#filtersconfigts) |
| [componentes/data-table.md](componentes/data-table.md) | [DataTable](componentes/data-table.md#datatable) · [dataTable.config.ts](componentes/data-table.md#datatableconfigts) |
| [componentes/stepper.md](componentes/stepper.md) | [Stepper](componentes/stepper.md#stepper) · [StepperFooter](componentes/stepper.md#stepperfooter) |

### Hooks y utilidades

| Archivo | Piezas |
| --- | --- |
| [hooks.md](hooks.md) | [useCatalogo](hooks.md#usecatalogo) · [useDebouncedCallback](hooks.md#usedebouncedcallback) · [useMutationConAviso](hooks.md#usemutationconaviso) · [usePaginacionLocal](hooks.md#usepaginacionlocal) · [use-mobile.ts](hooks.md#use-mobilets) |
| [lib.md](lib.md) | [format.utils.ts](lib.md#formatutilsts) · [date.utils.ts](lib.md#dateutilsts) · [catalogos.utils.ts](lib.md#catalogosutilsts) · [pagination.utils.ts](lib.md#paginationutilsts) · [urlParams.utils.ts](lib.md#urlparamsutilsts) · [zodMessages.utils.ts](lib.md#zodmessagesutilsts) · [personas.config.ts](lib.md#personasconfigts) · [queryKeys.config.ts](lib.md#querykeysconfigts) · [apiError.utils.ts](lib.md#apierrorutilsts) · [Clientes HTTP](lib.md#clientes-http) · [utils.ts](lib.md#utilsts) |

## ¿Qué uso para...?

| Necesito... | Uso |
| --- | --- |
| Un campo de texto, fecha o número en un formulario | [TextField](componentes/form.md#textfield) |
| Un selector en un formulario | [SelectField](componentes/form.md#selectfield) |
| Agrupar campos de un formulario en bloques | [FormSection](componentes/form.md#formsection) |
| Un botón que espera una petición | [LoadingButton](componentes/form.md#loadingbutton) |
| Los botones de un formulario en un modal (cancelar y enviar) | [ModalFormFooter](componentes/form.md#modalformfooter) |
| Subir un archivo | [FileDropzone](componentes/form.md#filedropzone) |
| Un modal para confirmar una acción (anular, quitar, aprobar...) | [ConfirmModal](componentes/feedback.md#confirmmodal) |
| Mostrar el error de una petición, con "Reintentar" | [ErrorAlert](componentes/feedback.md#erroralert) |
| Un mensaje de "no hay nada" (con una acción opcional) | [EmptyState](componentes/feedback.md#emptystate) |
| Resolver carga, error y vacío de una pestaña de la ficha | [DetalleTabEstado](componentes/feedback.md#detalletabestado) |
| Una insignia con el estado de algo (activo, vencido, aprobado...) | [StatusBadge](componentes/feedback.md#statusbadge) |
| Un botón de icono con tooltip en una fila | [AccionButton](componentes/page.md#accionbutton) |
| El encabezado de una página | [PageHeader](componentes/page.md#pageheader) |
| Un listado con filtros en la URL | [SearchInput](componentes/filters.md#searchinput), [FilterSelect](componentes/filters.md#filterselect), [urlParams.utils.ts](lib.md#urlparamsutilsts) |
| Filtrar por un rango de fechas | [DateRangeFilter](componentes/filters.md#daterangefilter) |
| Una tabla con paginación del servidor | [DataTable](componentes/data-table.md#datatable) |
| Paginar en el navegador una lista que ya está completa (errores de un archivo) | [usePaginacionLocal](hooks.md#usepaginacionlocal) con [DataTable](componentes/data-table.md#datatable) |
| Un proceso por pasos | [Stepper](componentes/stepper.md#stepper) y [StepperFooter](componentes/stepper.md#stepperfooter) |
| Opciones de un catálogo del backend | [useCatalogo](hooks.md#usecatalogo) y [catalogos.utils.ts](lib.md#catalogosutilsts) |
| Mostrar fechas, montos o datos vacíos | [format.utils.ts](lib.md#formatutilsts) |
| Una mutación que avisa con un toast y refresca la caché | [useMutationConAviso](hooks.md#usemutationconaviso) |
| Invalidar desde una feature la caché de otra (empleados) | [queryKeys.config.ts](lib.md#querykeysconfigts) |
| Llamar al backend | [Clientes HTTP](lib.md#clientes-http) |
