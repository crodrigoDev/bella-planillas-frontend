import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import type { SelectOption } from "@/lib/types/options.types";
import { TIPO_CUENTA_OPTIONS } from "../config/datosFinancieros.config";

interface CuentaBancariaCamposProps {
  /** Sufijo de los campos: `id_banco_sueldo`, `cci_cts`... */
  cuenta: "sueldo" | "cts";
  bancoLabel: string;
  /** Opción para dejar la cuenta sin banco */
  sinBancoLabel: string;
  bancos: SelectOption[] | undefined;
  isLoadingBancos: boolean;
  /** Texto de ayuda del número de cuenta, por ejemplo el dato ya guardado enmascarado */
  nroPlaceholder?: string;
  /** Texto de ayuda del CCI */
  cciPlaceholder?: string;
}

/**
 * Campos de una cuenta bancaria: banco, tipo, número y CCI
 *
 * @remarks
 * Sirve para la cuenta de sueldo y para la de CTS, que piden lo mismo.
 */
export function CuentaBancariaCampos({
  cuenta,
  bancoLabel,
  sinBancoLabel,
  bancos,
  isLoadingBancos,
  nroPlaceholder,
  cciPlaceholder,
}: CuentaBancariaCamposProps) {
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
      <TextField
        name={`nro_cuenta_${cuenta}`}
        label="Nº de cuenta"
        optional
        placeholder={nroPlaceholder}
      />
      <TextField
        name={`cci_${cuenta}`}
        label="CCI"
        optional
        placeholder={cciPlaceholder}
      />
    </>
  );
}
