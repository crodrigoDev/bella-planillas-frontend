import { DetalleTabEstado } from "@/components/feedback/DetalleTabEstado";
import { FormSection } from "@/components/form/FormSection";
import { ResumenCampo } from "@/components/form/ResumenCampo";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatCurrency, maskEnd } from "@/lib/format.utils";
import {
  REGIMEN_PENSION_LABELS,
  REGIMEN_SALUD_OPTIONS,
  REGIMENES_SALUD_CON_EPS,
  TIPO_COMISION_OPTIONS,
  TIPO_CUENTA_OPTIONS,
} from "../config/datosFinancieros.config";
import { useDatosFinancierosEmpleado } from "../hooks/useDatosFinancieros";

interface DatosFinancierosEmpleadoProps {
  empleadoId: string;
}

const orDash = (value: string | null | undefined): string => value || "--";

/**
 * Pestaña Datos financieros de la ficha: pensiones, sueldo, cuentas y salud
 *
 * @remarks
 * El backend ya envía los números de cuenta, CCI y CUSPP enmascarados; aquí
 * solo se muestran con `maskEnd`, nunca completos.
 */
export function DatosFinancierosEmpleado({
  empleadoId,
}: DatosFinancierosEmpleadoProps) {
  const { data, isLoading, error, refetch } =
    useDatosFinancierosEmpleado(empleadoId);

  return (
    <DetalleTabEstado
      isLoading={isLoading}
      error={error}
      onRetry={() => refetch()}
      isEmpty={!data}
      emptyTitle="Sin datos financieros"
      emptyDescription="Este empleado todavía no tiene datos financieros registrados."
    >
      {data && (
        <FormSection
          title="Datos financieros"
          description="Previsión social, remuneración, cuentas y salud."
        >
          <ResumenCampo
            label="Régimen previsional"
            value={
              data.regimen_nombre
                ? (REGIMEN_PENSION_LABELS[data.regimen_nombre] ??
                  data.regimen_nombre)
                : "--"
            }
            className="sm:col-span-2"
          />
          {data.afp_nombre && (
            <>
              <ResumenCampo label="AFP administradora" value={data.afp_nombre} />
              <ResumenCampo label="CUSPP" value={maskEnd(data.cuspp, 3)} />
              <ResumenCampo
                label="Tipo de comisión"
                value={getOptionLabel(TIPO_COMISION_OPTIONS, data.tipo_comision)}
              />
            </>
          )}

          <ResumenCampo
            label="Sueldo básico mensual"
            value={formatCurrency(data.sueldo_basico)}
          />

          <ResumenCampo
            label="Banco de abono"
            value={orDash(data.banco_sueldo_nombre)}
          />
          <ResumenCampo
            label="Tipo de cuenta"
            value={getOptionLabel(TIPO_CUENTA_OPTIONS, data.tipo_cuenta_sueldo)}
          />
          <ResumenCampo
            label="Nº de cuenta"
            value={maskEnd(data.nro_cuenta_sueldo)}
          />
          <ResumenCampo label="CCI" value={maskEnd(data.cci_sueldo)} />

          <ResumenCampo
            label="Entidad de CTS"
            value={orDash(data.banco_cts_nombre)}
          />
          <ResumenCampo
            label="Tipo de cuenta CTS"
            value={getOptionLabel(TIPO_CUENTA_OPTIONS, data.tipo_cuenta_cts)}
          />
          <ResumenCampo
            label="Nº de cuenta CTS"
            value={maskEnd(data.nro_cuenta_cts)}
          />
          <ResumenCampo label="CCI CTS" value={maskEnd(data.cci_cts)} />

          <ResumenCampo
            label="Régimen de salud"
            value={getOptionLabel(REGIMEN_SALUD_OPTIONS, data.regimen_salud)}
            className="sm:col-span-2"
          />
          {REGIMENES_SALUD_CON_EPS.includes(data.regimen_salud) && (
            <>
              <ResumenCampo label="Entidad EPS" value={orDash(data.eps_nombre)} />
              <ResumenCampo label="Plan contratado" value={orDash(data.eps_plan)} />
              <ResumenCampo
                label="Copago mensual"
                value={formatCurrency(data.eps_costo_adicional)}
              />
            </>
          )}
        </FormSection>
      )}
    </DetalleTabEstado>
  );
}
