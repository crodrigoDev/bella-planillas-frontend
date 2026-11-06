# Bella Planillas · Frontend

Aplicación web para la gestión de planillas y personal. Hoy cubre el módulo de
**Gestión de personal** (empleados, contratos, derechohabientes, datos financieros,
asistencia e historial) para el rol `RRHH`.

> **¿Buscas un componente, hook o utilidad?** Revisa el [catálogo de lo reutilizable](docs/README.md).

## Contenido

- [Stack](#stack)
- [Inicio rápido](#inicio-rápido)
- [Arquitectura](#arquitectura)
- [Autenticación y roles](#autenticación-y-roles)
- [Convenciones](#convenciones)
- [Documentación](#documentación)

## Stack

| Área               | Tecnología                                                                  |
| ------------------ | --------------------------------------------------------------------------- |
| Base               | React 19, TypeScript, Vite 8 (con React Compiler)                           |
| Estilos y UI       | Tailwind CSS v4, shadcn/ui sobre `@base-ui/react`, `lucide-react`, `sonner` |
| Datos del servidor | TanStack Query, axios                                                       |
| Tablas             | TanStack Table                                                              |
| Formularios        | react-hook-form, zod (esquemas de `@jyp/shared-contracts`)                  |
| Estado local       | zustand                                                                     |
| Rutas              | react-router-dom v7                                                         |

## Inicio rápido

Necesitas [pnpm](https://pnpm.io) y el repositorio `bella-jyp-shared-contracts` clonado
**al lado** de este (`../bella-jyp-shared-contracts`): `@jyp/shared-contracts` se enlaza
desde esa carpeta.

```bash
pnpm install
```

Copia `.env.example` a `.env.local` y completa la URL del backend (debe incluir
`/api/v1`):

```bash
VITE_API_URL=https://<servidor-del-backend>/api/v1
```

| Comando        | Qué hace                                                    |
| -------------- | ----------------------------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo de Vite                              |
| `pnpm build`   | Revisa los tipos (`tsc -b`) y genera el build de producción |
| `pnpm lint`    | ESLint                                                      |
| `pnpm preview` | Sirve el build de producción                                |

No hay corredor de pruebas configurado. El alias `@` apunta a `src/`.

## Arquitectura

```text
src/
├── app/          Configuración global: providers, layouts y rutas
├── pages/        Pantallas de cada ruta (solo arman la vista)
├── features/     Módulos por dominio (empleados, contratos, asistencia...)
├── components/   Componentes compartidos
│   ├── ui/       Piezas de shadcn/ui (no se editan)
│   └── form/ feedback/ page/ filters/ data-table/ stepper/
├── hooks/        Hooks que usa más de una feature
└── lib/          Clientes HTTP y utilidades puras
```

### `features/`

Cada feature es un módulo de dominio con su propia carpeta de `components/`, `hooks/`,
`services/` y `types/` (y `config/`, `utils/` o `schemas/` cuando hacen falta).

| Feature            | Qué cubre                                                     |
| ------------------ | ------------------------------------------------------------- |
| `auth`             | Login, recuperación de contraseña, sesión y control de acceso |
| `navigation`       | Menú lateral                                                  |
| `empleados`        | Listado, registro por pasos, ficha y edición                  |
| `contratos`        | Contratos de la ficha                                         |
| `derechohabientes` | Familiares y sus sustentos                                    |
| `datosFinancieros` | Previsión social, cuentas y salud                             |
| `asistencia`       | Resumen mensual y detalle diario                              |
| `historial`        | Línea de tiempo del empleado                                  |

Reglas que se mantienen:

- Una feature **nunca importa de otra**. La excepción es `empleados`, que arma el
  registro por pasos y la ficha con las demás.
- Contratos, derechohabientes y datos financieros son sub-recursos del empleado: cada
  uno es su propia feature y la ficha los muestra como pestañas.
- Los componentes de una feature se agrupan por área (por ejemplo
  `empleados/components/{listado,detalle,edicion,modals,registro}/`).
- La capa de datos va separada de la vista: `services/` habla con el backend, `hooks/`
  envuelve las consultas de TanStack Query, y los componentes solo pintan.

### Rutas y roles

Las rutas se declaran en `src/app/routes/router.tsx`, envueltas en `RoleRoute`. Cada
ruta nueva también se registra en `features/auth/config/routeAccess.config.ts`
(`null` = cualquier usuario autenticado; si no aparece, se deniega). Las pantallas aún
no construidas están en `pendingPages.config.ts`.

Por ahora solo está activo el rol `RRHH`.

### Peticiones al backend

- `publicHttpClient`: login, renovación de sesión y recuperación de contraseña.
- `protectedHttpClient`: el resto de las llamadas. Agrega el token y, ante un `401`,
  renueva la sesión y reintenta una vez.
- Los errores se muestran con `getApiErrorMessage` (o el componente `ErrorAlert`).

## Autenticación y roles

La sesión vive en el store de zustand `features/auth/store/auth.store.ts`. El token de
acceso queda **solo en memoria**, nunca se guarda en el navegador. Los componentes la
leen con `useAuth()`; al cargar la página, `AuthProvider` restaura la sesión con
`bootstrap()` y limpia la caché de TanStack Query cuando la sesión se cierra.

## Convenciones

Las principales reglas del proyecto:

- **Archivos:** componentes en `PascalCase`; el resto en `camelCase` con sufijo de rol
  (`*.service.ts`, `use*.ts`, `*.types.ts`, `*.utils.ts`).
- **Nombres:** entidades del negocio en español sin tildes ni `ñ` (`empleados`,
  `contratos`); patrones de UI y métodos en inglés (`Modal`, `handleSubmit`).
- **Funciones:** `function` para componentes, hooks y funciones principales; flechas
  para handlers, utilidades y métodos de servicios.
- **Comentarios:** TSDoc en español claro y simple.
- **Formularios:** react-hook-form + `zodResolver` con los esquemas del contrato y
  `zodResolverOptions` (mensajes en español).
- **Commits:** `tipo(alcance): descripción en minúsculas en español`.

## Documentación

| Documento                             | Contenido                                                          |
| ------------------------------------- | ------------------------------------------------------------------ |
| [docs/README.md](docs/README.md)      | Índice del catálogo y reglas para componentes compartidos          |
| [docs/componentes/](docs/componentes) | Formularios, avisos, página, filtros, tablas y pasos               |
| [docs/hooks.md](docs/hooks.md)        | Hooks compartidos                                                  |
| [docs/lib.md](docs/lib.md)            | Utilidades de formato, fechas, catálogos, URL, zod y clientes HTTP |
