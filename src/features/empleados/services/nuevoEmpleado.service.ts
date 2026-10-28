import type {
  CrearEmpleadoDto,
  RegistrarDerechohabienteDto,
} from "@jyp/shared-contracts";
import type { ApiResponse } from "@/lib/api/types/api.types";
import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type { DerechohabienteDraft } from "../schemas/datosDerechohabiente.schema";
import type { DatosContratoDraft } from "../schemas/datosContrato.schema";
import type { DatosFinancierosDraft } from "../schemas/datosFinancieros.schema";

/**
 * Operaciones del backend con las que se registra un empleado nuevo
 *
 * @remarks
 * El registro no es una sola llamada: primero se crea el empleado y con su
 * id se crean después los datos financieros, el contrato y los derechohabientes.
 */
export const nuevoEmpleadoService = {
  /**
   * Crea el empleado
   *
   * @returns El id del empleado creado
   */
  crearEmpleado: async (dto: CrearEmpleadoDto): Promise<string> => {
    const response = await protectedHttpClient.post<ApiResponse<{ id: string }>>(
      "/rrhh/empleado",
      dto,
    );

    return response.data.data.id;
  },

  /**
   * Crea los datos financieros de un empleado
   *
   * @remarks
   * La fecha de filiación a la AFP no se envía aquí: se guarda en el empleado.
   */
  crearDatosFinancieros: async (
    empleadoId: string,
    datos: Omit<DatosFinancierosDraft, "afp_fecha_filiacion">,
  ): Promise<void> => {
    await protectedHttpClient.post("/payroll/dato-financiero", {
      ...datos,
      empleado_id: empleadoId,
    });
  },

  /** Crea el contrato de un empleado */
  crearContrato: async (
    empleadoId: string,
    contrato: DatosContratoDraft,
  ): Promise<void> => {
    await protectedHttpClient.post("/rrhh/contrato", {
      ...contrato,
      empleado_id: empleadoId,
    });
  },

  /** Registra un derechohabiente de un empleado */
  registrarDerechohabiente: async (
    empleadoId: string,
    derechohabiente: DerechohabienteDraft,
  ): Promise<void> => {
    const dto: RegistrarDerechohabienteDto = {
      ...derechohabiente,
      empleado_id: empleadoId,
    };

    await protectedHttpClient.post("/rrhh/derechohabientes/registrar", dto);
  },
};
