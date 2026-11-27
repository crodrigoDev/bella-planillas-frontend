import { create } from "zustand";
import type { CrearEmpleadoDto } from "@jyp/shared-contracts";
import type { DerechohabienteDraft } from "@/features/derechohabientes/schemas/datosDerechohabiente.schema";
import type { DatosContratoDraft } from "../schemas/datosContrato.schema";
import type { DatosFinancierosDraft } from "../schemas/datosFinancieros.schema";

/**
 * Qué parte del registro ya se guardó en el backend
 *
 * @remarks
 * El registro se envía en varias llamadas. Si una falla, esto permite
 * reintentar solo lo que falta, sin volver a crear lo que ya existe.
 */
export interface ProgresoRegistro {
  /** Id del empleado una vez creado; null mientras no se crea */
  empleadoId: string | null;
  financierosListos: boolean;
  contratoListo: boolean;
  /** Cuántos derechohabientes (en orden de la lista) ya se registraron */
  derechohabientesListos: number;
}

const INITIAL_PROGRESO: ProgresoRegistro = {
  empleadoId: null,
  financierosListos: false,
  contratoListo: false,
  derechohabientesListos: 0,
};

interface NuevoEmpleadoState {
  /** Paso del registro que se muestra, empezando en 0 */
  step: number;
  /** Si se entró a editar un paso desde el resumen, al guardar vuelve directo a él */
  volverAlResumen: boolean;
  /** Datos del paso 1 ya validados; null mientras no se completa */
  datos: CrearEmpleadoDto | null;
  /** Datos del paso 2 ya validados; null mientras no se completa */
  datosFinancieros: DatosFinancierosDraft | null;
  /** Datos del paso 3 ya validados; null mientras no se completa */
  contrato: DatosContratoDraft | null;
  /** Derechohabientes del paso 4; vacío porque el paso es opcional */
  derechohabientes: DerechohabienteDraft[];
  /** Avance del envío al backend, que ocurre en el último paso */
  progreso: ProgresoRegistro;
  saveDatos: (datos: CrearEmpleadoDto) => void;
  saveDatosFinancieros: (datosFinancieros: DatosFinancierosDraft) => void;
  saveContrato: (contrato: DatosContratoDraft) => void;
  addDerechohabiente: (derechohabiente: DerechohabienteDraft) => void;
  updateDerechohabiente: (
    index: number,
    derechohabiente: DerechohabienteDraft,
  ) => void;
  removeDerechohabiente: (index: number) => void;
  updateProgreso: (progreso: Partial<ProgresoRegistro>) => void;
  goToStep: (step: number) => void;
  editarPaso: (step: number) => void;
  reset: () => void;
}

const RESUMEN_STEP = 4;

const INITIAL_STATE = {
  step: 0,
  volverAlResumen: false,
  datos: null,
  datosFinancieros: null,
  contrato: null,
  derechohabientes: [] as DerechohabienteDraft[],
  progreso: INITIAL_PROGRESO,
};

/**
 * Guarda en memoria el borrador del registro de un empleado
 *
 * @remarks
 * Conserva lo escrito al pasar de un paso a otro, y al volver atrás.
 * Son datos personales, por eso no se guardan en el navegador: se pierden
 * al recargar la página.
 */
export const useNuevoEmpleadoStore = create<NuevoEmpleadoState>()((set) => ({
  ...INITIAL_STATE,

  saveDatos: (datos) => set({ datos }),
  saveDatosFinancieros: (datosFinancieros) => set({ datosFinancieros }),
  saveContrato: (contrato) => set({ contrato }),
  addDerechohabiente: (derechohabiente) =>
    set((state) => ({
      derechohabientes: [...state.derechohabientes, derechohabiente],
    })),
  updateDerechohabiente: (index, derechohabiente) =>
    set((state) => ({
      derechohabientes: state.derechohabientes.map((item, i) =>
        i === index ? derechohabiente : item,
      ),
    })),
  removeDerechohabiente: (index) =>
    set((state) => ({
      derechohabientes: state.derechohabientes.filter((_, i) => i !== index),
    })),
  updateProgreso: (progreso) =>
    set((state) => ({ progreso: { ...state.progreso, ...progreso } })),
  goToStep: (step) =>
    set((state) => {
      // Al editar desde el resumen, avanzar lleva directo al resumen; retroceder ("Atrás") sigue igual
      const destino =
        state.volverAlResumen && step > state.step ? RESUMEN_STEP : step;

      return {
        step: destino,
        volverAlResumen:
          destino === RESUMEN_STEP ? false : state.volverAlResumen,
      };
    }),
  editarPaso: (step) => set({ step, volverAlResumen: true }),
  reset: () => set(INITIAL_STATE),
}));
