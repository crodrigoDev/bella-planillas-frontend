import type { StepperStep } from "@/components/stepper/Stepper";

/**
 * Pasos del registro de un nuevo empleado, en el orden del diseño
 *
 * @remarks
 * Cada paso se guarda con una operación distinta del backend: empleado,
 * datos financieros, contrato y derechohabientes.
 */
export const NUEVO_EMPLEADO_STEPS: readonly StepperStep[] = [
  { id: "datos", label: "Datos del empleado" },
  { id: "financieros", label: "Datos financieros" },
  { id: "contrato", label: "Contrato" },
  {
    id: "derechohabientes",
    label: "Derechohabientes",
    pendingCaption: "(Opcional)",
  },
  { id: "resumen", label: "Resumen", pendingCaption: "Confirmación" },
];
