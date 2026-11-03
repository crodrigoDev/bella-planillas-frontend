# components/stepper/

[← Volver al índice](../README.md)

## Stepper

Muestra el avance de un proceso de varios pasos (completado, en curso, pendiente).
Solo muestra el estado: quien lo usa decide el paso actual. Exporta el tipo
`StepperStep`.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `steps` | `readonly StepperStep[]` | `{ id: string; label: string; pendingCaption?: string }` |
| `currentStep` | `number` | Posición del paso actual, desde 0 |
| `className` | `string?` | |

```tsx
export const NUEVO_EMPLEADO_STEPS: readonly StepperStep[] = [
  { id: "datos", label: "Datos del empleado" },
  { id: "financieros", label: "Datos financieros" },
  { id: "resumen", label: "Resumen", pendingCaption: "Confirmación" },
];

<Stepper steps={NUEVO_EMPLEADO_STEPS} currentStep={step} />
```

[`src/features/empleados/config/nuevoEmpleado.config.ts`](../../src/features/empleados/config/nuevoEmpleado.config.ts) (resumido) y
[`src/pages/empleados/NuevoEmpleadoPage.tsx`](../../src/pages/empleados/NuevoEmpleadoPage.tsx)

## StepperFooter

Barra inferior pegada al borde de la pantalla mientras se llena un formulario largo:
cancelar a la izquierda, texto de avance y botones a la derecha.

| Prop | Tipo | Notas |
| --- | --- | --- |
| `cancelAction` | `ReactNode` | Botón para cancelar todo el proceso |
| `progressLabel` | `string` | Por ejemplo "Paso 1 de 5" |
| `children` | `ReactNode` | Botones de retroceder o continuar |
| `className` | `string?` | |

```tsx
<StepperFooter
  cancelAction={<Button variant="ghost" /* ... */>Cancelar</Button>}
  progressLabel={`Paso ${step + 1} de ${NUEVO_EMPLEADO_STEPS.length}`}
>
  {/* botones Atrás y Guardar y continuar (resumido) */}
</StepperFooter>
```

[`src/features/empleados/components/registro/RegistroFooter.tsx`](../../src/features/empleados/components/registro/RegistroFooter.tsx)

