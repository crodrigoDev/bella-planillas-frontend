import { SearchIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { useTiposDocumento } from "../../hooks/useCatalogos";
import { useDatosReniec } from "../../hooks/useDatosReniec";

/**
 * Botón secundario para autocompletar nombres y apellidos desde RENIEC cuando
 * el documento elegido es DNI y tiene 8 dígitos
 */
export function BuscarReniecButton() {
  const { control } = useFormContext();
  const documentoId = useWatch({ control, name: "documento_id" });
  const nroDocumento = useWatch({ control, name: "nro_documento" });

  const tiposDocumento = useTiposDocumento();

  const tipoLabel = getOptionLabel(tiposDocumento.data, documentoId);
  const esDni = tipoLabel.trim().toUpperCase() === "DNI";
  const dniLimpio = (nroDocumento ?? "").trim();
  const puedeBuscar = esDni && /^\d{8}$/.test(dniLimpio);

  if (!puedeBuscar) return null;

  // La `key` reinicia el estado (y error) de la consulta si cambia el DNI
  return <BuscarReniecAccion key={dniLimpio} dni={dniLimpio} />;
}

interface BuscarReniecAccionProps {
  dni: string;
}

function BuscarReniecAccion({ dni }: BuscarReniecAccionProps) {
  const { getValues, setValue } = useFormContext();
  const reniec = useDatosReniec();

  const handleBuscar = () => {
    const dniBuscado = dni;

    reniec.mutate(dniBuscado, {
      onSuccess: ({ nombre, apellido_paterno, apellido_materno }) => {
        const dniActual = String(getValues("nro_documento") ?? "").trim();
        if (dniActual !== dniBuscado) return;

        setValue("nombre", nombre, { shouldValidate: true });
        setValue(
          "apellido",
          `${apellido_paterno} ${apellido_materno}`.trim(),
          { shouldValidate: true },
        );
      },
    });
  };

  return (
    <div className="space-y-2">
      <LoadingButton
        type="button"
        variant="outline"
        size="sm"
        isLoading={reniec.isPending}
        loadingText="Buscando en RENIEC…"
        icon={SearchIcon}
        onClick={handleBuscar}
      >
        Buscar en RENIEC
      </LoadingButton>
      <ErrorAlert error={reniec.error} />
    </div>
  );
}
