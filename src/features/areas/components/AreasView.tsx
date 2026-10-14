import { useState } from "react";
import { Plus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import type { CrearAreaDto } from "@jyp/shared-contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table/DataTable";
import type { DataTableFeatures } from "@/components/data-table/data-table.config";
import ModulePage from "@/components/modules/ModulePage";
import ModuleSearch from "@/components/modules/ModuleSearch";
import RecordStatus from "@/components/modules/RecordStatus";
import { AreaActions } from "./AreaActions";
import { AreaDeactivateDialog } from "./AreaDeactivateDialog";
import { AreaFormDialog } from "./AreaFormDialog";
import { useAreas } from "../hooks/useAreas";
import type { AreaViewModel } from "../types/areas.types";

const column = createColumnHelper<DataTableFeatures, AreaViewModel>();

/** Presenta las areas con los mismos estilos y tabla del listado de empleados */
export function AreasView() {
  const {
    areas,
    setAreas,
    search,
    setSearch,
    filteredAreas,
    activeAreasCount,
  } = useAreas();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaViewModel | undefined>();
  const [deactivationArea, setDeactivationArea] = useState<
    AreaViewModel | undefined
  >();
  const [successMessage, setSuccessMessage] = useState("");

  const handleOpenCreate = (): void => {
    setSelectedArea(undefined);
    setSuccessMessage("");
    setIsFormOpen(true);
  };
  const handleOpenEdit = (area: AreaViewModel): void => {
    setSelectedArea(area);
    setSuccessMessage("");
    setIsFormOpen(true);
  };
  const handleSaveArea = (values: CrearAreaDto): void => {
    if (selectedArea) {
      setAreas((current) =>
        current.map((area) =>
          area.id === selectedArea.id
            ? {
                ...area,
                nombre: values.nombre,
                descripcion: values.descripcion,
              }
            : area,
        ),
      );
      setSuccessMessage("Área actualizada correctamente");
    } else {
      setAreas((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          nombre: values.nombre,
          descripcion: values.descripcion,
          activeEmployees: 0,
          activePositions: 0,
          associatedSchedules: 0,
          isActive: true,
        },
      ]);
      setSuccessMessage("Área registrada correctamente");
    }
    setSearch("");
  };
  const handleRequestDeactivate = (area: AreaViewModel): void => {
    if (!area.isActive) return;
    setSuccessMessage("");
    setDeactivationArea(area);
  };
  const handleConfirmDeactivate = (): void => {
    if (!deactivationArea) return;
    const current = areas.find((area) => area.id === deactivationArea.id);
    if (
      !current ||
      !current.isActive ||
      current.activeEmployees > 0 ||
      current.activePositions > 0
    )
      return;
    setAreas((items) =>
      items.map((area) =>
        area.id === current.id ? { ...area, isActive: false } : area,
      ),
    );
    setSuccessMessage("Área desactivada correctamente");
    setDeactivationArea(undefined);
  };

  const columns = column.columns([
    column.accessor("nombre", {
      header: "Área",
      cell: ({ getValue }) => (
        <p className="min-w-44 font-medium">{getValue()}</p>
      ),
    }),
    column.accessor("descripcion", {
      header: "Descripción",
      cell: ({ getValue }) => (
        <p className="max-w-80 whitespace-normal text-muted-foreground">
          {getValue() || "Sin descripción"}
        </p>
      ),
    }),
    column.accessor("activeEmployees", { header: "Empleados activos" }),
    column.accessor("activePositions", { header: "Cargos activos" }),
    column.accessor("associatedSchedules", { header: "Jornadas asociadas" }),
    column.accessor("isActive", {
      header: "Estado",
      cell: ({ getValue }) => <RecordStatus active={getValue()} />,
    }),
    column.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <AreaActions
          area={row.original}
          onEdit={handleOpenEdit}
          onDeactivate={handleRequestDeactivate}
        />
      ),
    }),
  ]);

  return (
    <ModulePage
      title="Áreas"
      description="Administra las áreas de la empresa"
      message={successMessage}
      action={
        <Button className="h-9 px-4 text-xs" onClick={handleOpenCreate}>
          <Plus aria-hidden className="size-3.5" />
          Registrar área
        </Button>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ModuleSearch
          label="Buscar áreas por nombre o descripción"
          placeholder="Buscar por nombre o descripción"
          value={search}
          onChange={setSearch}
          className="w-full sm:max-w-md"
        />
        <Badge variant="secondary" className="text-[11px]">
          {activeAreasCount} áreas activas
        </Badge>
      </div>
      <DataTable
        columns={columns}
        data={filteredAreas}
        getRowId={(area) => area.id}
        caption="Áreas de la empresa"
      />
      {isFormOpen && (
        <AreaFormDialog
          isOpen={isFormOpen}
          area={selectedArea}
          onOpenChange={setIsFormOpen}
          onSave={handleSaveArea}
        />
      )}
      {deactivationArea && (
        <AreaDeactivateDialog
          area={deactivationArea}
          onClose={() => setDeactivationArea(undefined)}
          onConfirm={handleConfirmDeactivate}
        />
      )}
    </ModulePage>
  );
}
