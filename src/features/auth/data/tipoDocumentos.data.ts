import type { LoginDTO } from "@jyp/shared-contracts";

/**
 * Relaciona los valores de documento del contrato con sus etiquetas visibles
 */
export const TIPOS_DOCUMENTOS = [
  { value: "DNI", label: "DNI" },
  { value: "CE", label: "CE" },
  { value: "PASAPORTE", label: "Pasaporte" },
] satisfies Array<{
  value: LoginDTO["tipo_documento"];
  label: string;
}>;
