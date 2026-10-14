import { useState } from "react";
import { Plus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/data-table/DataTable";
import type { DataTableFeatures } from "@/components/data-table/data-table.config";
import ModulePage from "@/components/modules/ModulePage";
import ModuleSelect from "@/components/modules/ModuleSelect";
import RecordStatus from "@/components/modules/RecordStatus";
import ConfirmActionDialog from "@/components/modules/ConfirmActionDialog";
import { AREAS_MOCK } from "@/features/empleados/data/empleados.mock";
import { formatEmpleadoSueldo } from "@/features/empleados/utils/empleados.utils";
import { CARGOS_LISTADO_MOCK } from "../data/cargos.mock";
import {
  cambiarEstadoCargoMock,
  guardarCargoMock,
} from "../utils/cargos.actions";
import type { CargoListado } from "../types/cargos.types";
import CargoFormDialog from "./CargoFormDialog";

const column = createColumnHelper<DataTableFeatures, CargoListado>();

/** Presenta los cargos con filtros y acciones locales */
export default function CargosView() {
  const [data, setData] = useState(() => [...CARGOS_LISTADO_MOCK]);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [editing, setEditing] = useState<CargoListado | null | undefined>();
  const [changing, setChanging] = useState<CargoListado | null>(null);
  const [message, setMessage] = useState("");
  const filtered = data.filter(
    (cargo) =>
      `${cargo.nombre} ${cargo.descripcion ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (area === "todos" || cargo.id_area === area) &&
      (estado === "todos" || cargo.activo === (estado === "activo")),
  );
  const columns = column.columns([
    column.accessor("nombre", {
      header: "Cargo",
      cell: ({ row }) => (
        <div className="min-w-44">
          <p className="font-medium">{row.original.nombre}</p>
          <p className="mt-1 max-w-64 truncate text-muted-foreground">
            {row.original.descripcion}
          </p>
        </div>
      ),
    }),
    column.accessor("area.nombre", { header: "Área" }),
    column.accessor("sueldo_minimo", {
      header: "Banda salarial",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.sueldo_minimo == null
            ? "Sin mínimo"
            : formatEmpleadoSueldo(row.original.sueldo_minimo)}{" "}
          –{" "}
          {row.original.sueldo_maximo == null
            ? "Sin máximo"
            : formatEmpleadoSueldo(row.original.sueldo_maximo)}
        </span>
      ),
    }),
    column.accessor("total_empleados", { header: "Empleados activos" }),
    column.accessor("activo", {
      header: "Estado",
      cell: ({ getValue }) => <RecordStatus active={getValue()} />,
    }),
    column.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            disabled={!row.original.activo}
            onClick={() => setEditing(row.original)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setChanging(row.original)}
          >
            {row.original.activo ? "Desactivar" : "Reactivar"}
          </Button>
        </div>
      ),
    }),
  ]);
  return (
    <ModulePage
      title="Cargos"
      description="Organiza los puestos y sus bandas salariales"
      message={message}
      action={
        <Button size="sm" onClick={() => setEditing(null)}>
          <Plus aria-hidden />
          Nuevo cargo
        </Button>
      }
    >
      <div className="grid items-end gap-3 sm:grid-cols-3">
        <Input
          aria-label="Buscar cargos"
          placeholder="Buscar por nombre o descripción"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <ModuleSelect
          label="Área"
          value={area}
          onChange={setArea}
          items={[
            { value: "todos", label: "Todas" },
            ...AREAS_MOCK.map((item) => ({
              value: item.id,
              label: item.nombre,
            })),
          ]}
        />
        <ModuleSelect
          label="Estado"
          value={estado}
          onChange={setEstado}
          items={[
            { value: "todos", label: "Todos" },
            { value: "activo", label: "Activos" },
            { value: "inactivo", label: "Inactivos" },
          ]}
        />
      </div>
      <DataTable
        data={filtered}
        columns={columns}
        getRowId={(row) => row.id}
        caption="Cargos de la empresa"
      />
      {editing !== undefined && (
        <CargoFormDialog
          cargo={editing ?? undefined}
          onClose={() => setEditing(undefined)}
          onSave={(values) => {
            guardarCargoMock(values, editing?.id);
            setData([...CARGOS_LISTADO_MOCK]);
            setMessage("Cargo guardado en la vista de prueba");
          }}
        />
      )}
      {changing && (
        <ConfirmActionDialog
          title={changing.activo ? "Desactivar cargo" : "Reactivar cargo"}
          description={changing.nombre}
          onClose={() => setChanging(null)}
          onConfirm={() => {
            cambiarEstadoCargoMock(changing.id);
            setData([...CARGOS_LISTADO_MOCK]);
            setMessage("Estado del cargo actualizado");
          }}
        />
      )}
    </ModulePage>
  );
}
