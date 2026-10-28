import { create } from "zustand";
import type { CrearEmpleadoDto } from "@jyp/shared-contracts";
import type { DatosContratoDraft } from "../schemas/datosContrato.schema";
import type { DatosFinancierosDraft } from "../schemas/datosFinancieros.schema";

interface NuevoEmpleadoState {
  /** Paso del registro que se muestra, empezando en 0 */
  step: number;
  /** Datos del paso 1 ya validados; null mientras no se completa */
  datos: CrearEmpleadoDto | null;
  /** Datos del paso 2 ya validados; null mientras no se completa */
  datosFinancieros: DatosFinancierosDraft | null;
  /** Datos del paso 3 ya validados; null mientras no se completa */
  contrato: DatosContratoDraft | null;
  saveDatos: (datos: CrearEmpleadoDto) => void;
  saveDatosFinancieros: (datosFinancieros: DatosFinancierosDraft) => void;
  saveContrato: (contrato: DatosContratoDraft) => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  step: 0,
  datos: null,
  datosFinancieros: null,
  contrato: null,
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
  goToStep: (step) => set({ step }),
  reset: () => set(INITIAL_STATE),
}));
