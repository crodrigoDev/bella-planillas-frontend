import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { Plus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  TurnoJornadaEnum,
  ModalidadJornadaEnum,
  DuracionJornadaEnum,
} from "@jyp/shared-contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/data-table/DataTable";
import type { DataTableFeatures } from "@/components/data-table/data-table.config";
import ModulePage from "@/components/modules/ModulePage";
import ModuleSelect from "@/components/modules/ModuleSelect";
import RecordStatus from "@/components/modules/RecordStatus";
import ConfirmActionDialog from "@/components/modules/ConfirmActionDialog";
import { enumItems, moduleLabel } from "@/components/modules/module.utils";
import { AREAS_MOCK } from "@/features/empleados/data/empleados.mock";
import { JORNADAS_LISTADO_MOCK } from "../data/jornadas.mock";
import {
  cambiarEstadoJornadaMock,
  guardarJornadaMock,
} from "../utils/jornadas.actions";
import type { JornadaListado } from "../types/jornadas.types";
import JornadaFormDialog from "./JornadaFormDialog";

const column = createColumnHelper<DataTableFeatures, JornadaListado>();

/** Lista jornadas y abre su horario en el mismo dialogo de edicion */
export default function JornadasView() {
  const [data, setData] = useState(() => [...JORNADAS_LISTADO_MOCK]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    area: "todos",
    turno: "todos",
    modalidad: "todos",
    duracion: "todos",
    estado: "todos",
  });
  const [editing, setEditing] = useState<JornadaListado | undefined>();
  const [changing, setChanging] = useState<JornadaListado | null>(null);
  const location = useLocation();
  const [message, setMessage] = useState(
    typeof location.state?.message === "string" ? location.state.message : "",
  );
  const filtered = data.filter(
    (item) =>
      `${item.nombre} ${item.descripcion ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filters.area === "todos" || item.areas_ids.includes(filters.area)) &&
      (filters.turno === "todos" || item.turno === filters.turno) &&
      (filters.modalidad === "todos" || item.modalidad === filters.modalidad) &&
      (filters.duracion === "todos" || item.duracion === filters.duracion) &&
      (filters.estado === "todos" ||
        item.activo === (filters.estado === "activo")),
  );
  const columns = column.columns([
    column.accessor("nombre", {
      header: "Jornada",
      cell: ({ row }) => (
        <div className="min-w-36">
          <p className="font-medium">{row.original.nombre}</p>
          <p className="mt-1 text-muted-foreground">
            {moduleLabel(row.original.duracion)}
          </p>
        </div>
      ),
    }),
    column.accessor("turno", {
      header: "Turno / Modalidad",
      cell: ({ row }) => (
        <span>
          {moduleLabel(row.original.turno)} ·{" "}
          {moduleLabel(row.original.modalidad)}
        </span>
      ),
    }),
    column.accessor("total_horas_semana", {
      header: "Horas semanales",
      cell: ({ getValue }) => `${getValue()} h`,
    }),
    column.accessor("tolerancia_minutos", {
      header: "Tolerancia",
      cell: ({ getValue }) => `${getValue()} min`,
    }),
    column.accessor("total_areas", {
      header: "Áreas",
      cell: ({ row }) => (
        <span title={row.original.areas.map((area) => area.nombre).join(", ")}>
          {row.original.total_areas} áreas
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
            Horario / Editar
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
  const choices = [
    {
      key: "area",
      label: "Área",
      items: AREAS_MOCK.map((area) => ({ value: area.id, label: area.nombre })),
    },
    {
      key: "turno",
      label: "Turno",
      items: enumItems(TurnoJornadaEnum.options),
    },
    {
      key: "modalidad",
      label: "Modalidad",
      items: enumItems(ModalidadJornadaEnum.options),
    },
    {
      key: "duracion",
      label: "Duración",
      items: enumItems(DuracionJornadaEnum.options),
    },
    {
      key: "estado",
      label: "Estado",
      items: [
        { value: "activo", label: "Activas" },
        { value: "inactivo", label: "Inactivas" },
      ],
    },
  ] as const;
  return (
    <ModulePage
      title="Jornadas"
      description="Configura horarios, turnos y áreas aplicables"
      message={message}
      action={
        <Button
          size="sm"
          render={<Link to={ROUTE_PATHS.asistencia.crearJornada} />}
        >
          <Plus aria-hidden />
          Nueva jornada
        </Button>
      }
    >
      <Input
        className="max-w-md bg-background"
        aria-label="Buscar jornadas"
        placeholder="Buscar por nombre o descripción"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {choices.map((choice) => (
          <ModuleSelect
            key={choice.key}
            label={choice.label}
            value={filters[choice.key]}
            onChange={(value) =>
              setFilters((current) => ({ ...current, [choice.key]: value }))
            }
            items={[{ value: "todos", label: "Todos" }, ...choice.items]}
          />
        ))}
      </div>
      <DataTable
        data={filtered}
        columns={columns}
        getRowId={(row) => row.id}
        caption="Jornadas laborales"
      />
      {editing !== undefined && (
        <JornadaFormDialog
          jornada={editing}
          onClose={() => setEditing(undefined)}
          onSave={(values) => {
            guardarJornadaMock(values, editing?.id);
            setData([...JORNADAS_LISTADO_MOCK]);
            setMessage("Jornada guardada en la vista de prueba");
          }}
        />
      )}
      {changing && (
        <ConfirmActionDialog
          title={changing.activo ? "Desactivar jornada" : "Reactivar jornada"}
          description={changing.nombre}
          onClose={() => setChanging(null)}
          onConfirm={() => {
            cambiarEstadoJornadaMock(changing.id);
            setData([...JORNADAS_LISTADO_MOCK]);
            setMessage("Estado de la jornada actualizado");
          }}
        />
      )}
    </ModulePage>
  );
}
