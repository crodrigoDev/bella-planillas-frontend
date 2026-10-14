import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { TipoSolicitudEnum } from "@jyp/shared-contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/data-table/DataTable";
import type { DataTableFeatures } from "@/components/data-table/data-table.config";
import ModulePage from "@/components/modules/ModulePage";
import ModuleSelect from "@/components/modules/ModuleSelect";
import ModuleSearch from "@/components/modules/ModuleSearch";
import {
  enumItems,
  moduleDate,
  moduleLabel,
} from "@/components/modules/module.utils";
import { AREAS_MOCK } from "@/features/empleados/data/empleados.mock";
import { SOLICITUDES_MOCK } from "../data/solicitudes.mock";
import { crearSolicitudMock } from "../utils/solicitudes.actions";
import type { SolicitudListado } from "../types/solicitudes.types";
import SolicitudFormDialog from "./SolicitudFormDialog";
import SolicitudDetailDialog from "./SolicitudDetailDialog";

const column = createColumnHelper<DataTableFeatures, SolicitudListado>();

/** Muestra un listado local mientras el backend aun no expone la consulta general */
export default function SolicitudesView() {
  const [params] = useSearchParams();
  const [data, setData] = useState(() => [...SOLICITUDES_MOCK]);
  const [filters, setFilters] = useState({
    search: "",
    tipo: "todos",
    estado: params.get("estado") ?? "todos",
    area: "todos",
    desde: "",
    hasta: "",
  });
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    params.get("solicitud"),
  );
  const selected = data.find((item) => item.id === selectedId);
  const [message, setMessage] = useState("");
  const filtered = data.filter(
    (item) =>
      `${item.codigo} ${item.colaborador_resumen.nombre_completo} ${item.colaborador_resumen.documento}`
        .toLowerCase()
        .includes(filters.search.toLowerCase()) &&
      (filters.tipo === "todos" || item.tipo === filters.tipo) &&
      (filters.estado === "todos" ||
        item.estado === filters.estado ||
        (filters.estado === "pendientes" &&
          ["PENDIENTE", "EN_REVISION"].includes(item.estado))) &&
      (filters.area === "todos" ||
        item.colaborador_resumen.area ===
          AREAS_MOCK.find((area) => area.id === filters.area)?.nombre) &&
      (!filters.desde || item.fecha_solicitud.slice(0, 10) >= filters.desde) &&
      (!filters.hasta || item.fecha_solicitud.slice(0, 10) <= filters.hasta),
  );
  const columns = column.columns([
    column.accessor("codigo", {
      header: "Solicitud",
      cell: ({ row }) => (
        <div className="min-w-36">
          <button
            className="font-medium text-primary hover:underline"
            onClick={() => setSelectedId(row.original.id)}
          >
            {row.original.codigo}
          </button>
          <p className="mt-1 text-muted-foreground">
            {moduleLabel(row.original.tipo)}
          </p>
        </div>
      ),
    }),
    column.accessor("colaborador_resumen.nombre_completo", {
      header: "Colaborador",
      cell: ({ row }) => (
        <div className="min-w-44">
          <p>{row.original.colaborador_resumen.nombre_completo}</p>
          <p className="mt-1 text-muted-foreground">
            {row.original.colaborador_resumen.area}
          </p>
        </div>
      ),
    }),
    column.accessor("fecha_solicitud", {
      header: "Fecha de registro",
      cell: ({ getValue }) => moduleDate(getValue()),
    }),
    column.accessor("estado", {
      header: "Estado",
      cell: ({ getValue }) => (
        <Badge
          variant="outline"
          className={
            getValue() === "APROBADA"
              ? "border-emerald-200 text-emerald-700"
              : getValue() === "RECHAZADA"
                ? "border-red-200 text-red-600"
                : "text-primary"
          }
        >
          {moduleLabel(getValue())}
        </Badge>
      ),
    }),
    column.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setSelectedId(row.original.id)}
        >
          Ver / Gestionar
        </Button>
      ),
    }),
  ]);
  const setFilter = (key: keyof typeof filters, value: string): void =>
    setFilters((current) => ({ ...current, [key]: value }));
  return (
    <ModulePage
      title="Solicitudes"
      description="Revisa vacaciones, permisos y novedades del personal"
      message={message}
      action={
        <Button className="h-9 px-4 text-xs" onClick={() => setCreating(true)}>
          <Plus aria-hidden />
          Nueva solicitud
        </Button>
      }
    >
      <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <ModuleSearch
          label="Buscar solicitudes"
          placeholder="Buscar por código, nombre o documento"
          value={filters.search}
          onChange={(value) => setFilter("search", value)}
        />
        <ModuleSelect
          inlineLabel
          label="Tipo"
          value={filters.tipo}
          onChange={(value) => setFilter("tipo", value)}
          items={[
            { value: "todos", label: "Todos" },
            ...enumItems(TipoSolicitudEnum.options),
          ]}
        />
        <ModuleSelect
          inlineLabel
          label="Estado"
          value={filters.estado}
          onChange={(value) => setFilter("estado", value)}
          items={[
            { value: "todos", label: "Todos" },
            { value: "pendientes", label: "Por revisar" },
            ...enumItems([
              "PENDIENTE",
              "EN_REVISION",
              "APROBADA",
              "RECHAZADA",
              "ANULADA",
            ]),
          ]}
        />
        <ModuleSelect
          inlineLabel
          label="Área"
          value={filters.area}
          onChange={(value) => setFilter("area", value)}
          items={[
            { value: "todos", label: "Todas" },
            ...AREAS_MOCK.map((area) => ({
              value: area.id,
              label: area.nombre,
            })),
          ]}
        />
        <label className="space-y-1.5 text-xs">
          Registro desde
          <Input
            type="date"
            className="h-9 bg-background text-xs"
            value={filters.desde}
            onChange={(event) => setFilter("desde", event.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-xs">
          Registro hasta
          <Input
            type="date"
            className="h-9 bg-background text-xs"
            value={filters.hasta}
            onChange={(event) => setFilter("hasta", event.target.value)}
          />
        </label>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(row) => row.id}
        caption="Solicitudes del personal"
      />
      {creating && (
        <SolicitudFormDialog
          onClose={() => setCreating(false)}
          onSave={(values) => {
            crearSolicitudMock(values);
            setData([...SOLICITUDES_MOCK]);
            setMessage("Solicitud registrada en la vista de prueba");
          }}
        />
      )}
      {selected && (
        <SolicitudDetailDialog
          solicitud={selected}
          onClose={() => setSelectedId(null)}
          onUpdate={() => {
            setData([...SOLICITUDES_MOCK]);
            setMessage("Solicitud actualizada en la vista de prueba");
          }}
        />
      )}
    </ModulePage>
  );
}
