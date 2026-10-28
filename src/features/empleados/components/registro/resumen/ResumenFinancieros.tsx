import { FormSection } from "@/components/form/FormSection";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatCurrency, formatDate, maskEnd } from "@/lib/format.utils";
import {
  REGIMEN_PENSION_LABELS,
  REGIMEN_SALUD_OPTIONS,
  REGIMENES_SALUD_CON_EPS,
  TIPO_COMISION_OPTIONS,
  TIPO_CUENTA_OPTIONS,
} from "../../../config/empleados.config";
import { useDatosFinancierosCatalogos } from "../../../hooks/useCatalogos";
import type { DatosFinancierosDraft } from "../../../schemas/datosFinancieros.schema";
import { ResumenCampo } from "./ResumenCampo";

interface ResumenFinancierosProps {
  datos: DatosFinancierosDraft;
}

/**
 * Resumen del paso 2: pensiones, sueldo, cuentas y régimen de salud
 *
 * @remarks
 * Los números de cuenta y CCI se muestran ocultos, solo con los últimos
 * dígitos, porque son datos sensibles.
 */
export function ResumenFinancieros({ datos }: ResumenFinancierosProps) {
  const { regimenes, afps, bancos } = useDatosFinancierosCatalogos();

  const regimen = regimenes.data?.find((item) => item.id === datos.id_regimen);
  const conEps = REGIMENES_SALUD_CON_EPS.includes(datos.regimen_salud);

  return (
    <FormSection
      title="Datos financieros"
      description="Previsión social, remuneración, cuentas y salud."
    >
      <ResumenCampo
        label="Régimen previsional"
        value={
          regimen
            ? (REGIMEN_PENSION_LABELS[regimen.nombre] ?? regimen.nombre)
            : "--"
        }
        className="sm:col-span-2"
      />
      {datos.id_tipo_afp && (
        <>
          <ResumenCampo
            label="AFP administradora"
            value={getOptionLabel(afps.data, datos.id_tipo_afp)}
          />
          <ResumenCampo label="CUSPP" value={maskEnd(datos.cuspp)} />
          <ResumenCampo
            label="Tipo de comisión"
            value={getOptionLabel(TIPO_COMISION_OPTIONS, datos.tipo_comision)}
          />
          <ResumenCampo
            label="Filiación a la AFP"
            value={formatDate(datos.afp_fecha_filiacion)}
          />
        </>
      )}

      <ResumenCampo
        label="Sueldo básico mensual"
        value={formatCurrency(datos.sueldo_basico)}
      />

      <ResumenCampo
        label="Banco de abono"
        value={getOptionLabel(bancos.data, datos.id_banco_sueldo)}
      />
      <ResumenCampo
        label="Tipo de cuenta"
        value={getOptionLabel(TIPO_CUENTA_OPTIONS, datos.tipo_cuenta_sueldo)}
      />
      <ResumenCampo
        label="Nº de cuenta"
        value={maskEnd(datos.nro_cuenta_sueldo)}
      />
      <ResumenCampo label="CCI" value={maskEnd(datos.cci_sueldo)} />

      <ResumenCampo
        label="Entidad de CTS"
        value={getOptionLabel(bancos.data, datos.id_banco_cts)}
      />
      <ResumenCampo
        label="Tipo de cuenta CTS"
        value={getOptionLabel(TIPO_CUENTA_OPTIONS, datos.tipo_cuenta_cts)}
      />
      <ResumenCampo
        label="Nº de cuenta CTS"
        value={maskEnd(datos.nro_cuenta_cts)}
      />
      <ResumenCampo label="CCI CTS" value={maskEnd(datos.cci_cts)} />

      <ResumenCampo
        label="Régimen de salud"
        value={getOptionLabel(REGIMEN_SALUD_OPTIONS, datos.regimen_salud)}
        className="sm:col-span-2"
      />
      {conEps && (
        <>
          <ResumenCampo label="Entidad EPS" value={datos.eps_nombre ?? "--"} />
          <ResumenCampo label="Plan contratado" value={datos.eps_plan ?? "--"} />
          <ResumenCampo
            label="Copago mensual"
            value={formatCurrency(datos.eps_costo_adicional)}
          />
        </>
      )}
    </FormSection>
  );
}
