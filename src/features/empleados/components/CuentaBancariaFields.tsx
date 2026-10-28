import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import type { FilterOption } from "@/lib/types/filters.types";
import { TIPO_CUENTA_OPTIONS } from "../config/empleados.config";

interface CuentaBancariaFieldsProps {
  /** Sufijo de los campos: `id_banco_sueldo`, `cci_cts`... */
  cuenta: "sueldo" | "cts";
  bancoLabel: string;
  /** Opción para dejar la cuenta sin banco */
  sinBancoLabel: string;
  bancos: FilterOption[] | undefined;
  isLoadingBancos: boolean;
}

/**
 * Campos de una cuenta bancaria: banco, tipo, número y CCI
 *
 * @remarks
 * Sirve para la cuenta de sueldo y para la de CTS, que piden lo mismo.
 */
export function CuentaBancariaFields({
  cuenta,
  bancoLabel,
  sinBancoLabel,
  bancos,
  isLoadingBancos,
}: CuentaBancariaFieldsProps) {
  return (
    <>
      <SelectField
        name={`id_banco_${cuenta}`}
        label={bancoLabel}
        options={bancos}
        isLoading={isLoadingBancos}
        clearLabel={sinBancoLabel}
      />
      <SelectField
        name={`tipo_cuenta_${cuenta}`}
        label="Tipo de cuenta"
        options={TIPO_CUENTA_OPTIONS}
        placeholder="Selecciona un tipo"
      />
      <TextField name={`nro_cuenta_${cuenta}`} label="Nº de cuenta" optional />
      <TextField name={`cci_${cuenta}`} label="CCI" optional />
    </>
  );
}
