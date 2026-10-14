import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ModulePage from "@/components/modules/ModulePage";
import ModuleSelect from "@/components/modules/ModuleSelect";
import {
  enumItems,
  moduleDate,
  moduleLabel,
} from "@/components/modules/module.utils";
import DataTable from "@/components/data-table/DataTable";
import type { DataTableFeatures } from "@/components/data-table/data-table.config";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";
import type { MarcacionEmpleado } from "@/features/empleados/types/ficha-empleado.types";
import { MARCACIONES_MOCK } from "../data/marcaciones.mock";
import {
  crearMarcacionMock,
  fechaMarcacionLima,
} from "../utils/marcaciones.actions";
import MarcacionFormDialog from "./MarcacionFormDialog";

const column = createColumnHelper<DataTableFeatures, MarcacionEmpleado>();

/** Lista los registros sin inventar acciones de edicion o borrado */
export default function MarcacionesView() {
  const [params] = useSearchParams();
  const [data, setData] = useState(() => [...MARCACIONES_MOCK]);
  const [filters, setFilters] = useState({
    empleado: "todos",
    tipo: "todos",
    inicio: params.get("fecha_inicio") ?? "2026-10-12",
    fin: params.get("fecha_fin") ?? "2026-10-14",
  });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const filtered = data.filter(
    (item) =>
      (filters.empleado === "todos" || item.empleado_id === filters.empleado) &&
      (filters.tipo === "todos" || item.tipo_marcacion === filters.tipo) &&
      (!filters.inicio ||
        fechaMarcacionLima(item.fecha_hora) >= filters.inicio) &&
      (!filters.fin || fechaMarcacionLima(item.fecha_hora) <= filters.fin),
  );
  const columns = column.columns([
    column.accessor("colaborador", {
      header: "Colaborador",
      cell: ({ row }) => (
        <div className="min-w-44">
          <Link
            to={`/empleados/${row.original.empleado_id}`}
            className="font-medium hover:text-primary"
          >
            {row.original.colaborador}
          </Link>
          <p className="mt-1 text-muted-foreground">
            {row.original.nro_documento}
          </p>
        </div>
      ),
    }),
    column.accessor("fecha_hora", {
      header: "Fecha y hora (Lima)",
      cell: ({ getValue }) => moduleDate(getValue()),
    }),
    column.accessor("tipo_marcacion", {
      header: "Marcación",
      cell: ({ getValue }) => (
        <Badge variant="outline" className="text-primary">
          {moduleLabel(getValue())}
        </Badge>
      ),
    }),
    column.accessor("metodo", { header: "Método" }),
  ]);
  const setFilter = (key: keyof typeof filters, value: string): void =>
    setFilters((current) => ({ ...current, [key]: value }));
  return (
    <ModulePage
      title="Marcaciones"
      description="Consulta entradas, salidas y registros de descanso"
      message={message}
      action={
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus aria-hidden />
          Registrar marcación
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ModuleSelect
          label="Empleado"
          value={filters.empleado}
          onChange={(value) => setFilter("empleado", value)}
          items={[
            { value: "todos", label: "Todos" },
            ...EMPLEADOS_MOCK.map((emp) => ({
              value: emp.id,
              label: getEmpleadoNombre(emp),
            })),
          ]}
        />
        <ModuleSelect
          label="Tipo"
          value={filters.tipo}
          onChange={(value) => setFilter("tipo", value)}
          items={[
            { value: "todos", label: "Todos" },
            ...enumItems(["ENTRADA", "SALIDA"]),
          ]}
        />
        <label className="space-y-1.5 text-xs">
          Desde
          <Input
            type="date"
            value={filters.inicio}
            onChange={(event) => setFilter("inicio", event.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-xs">
          Hasta
          <Input
            type="date"
            value={filters.fin}
            onChange={(event) => setFilter("fin", event.target.value)}
          />
        </label>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(row) => row.id}
        caption="Registro de marcaciones"
      />
      {creating && (
        <MarcacionFormDialog
          onClose={() => setCreating(false)}
          onSave={(values) => {
            crearMarcacionMock(values);
            setData([...MARCACIONES_MOCK]);
            setFilters((current) => ({
              ...current,
              inicio: fechaMarcacionLima(values.fecha_hora.toISOString()),
              fin: fechaMarcacionLima(values.fecha_hora.toISOString()),
              empleado: "todos",
              tipo: "todos",
            }));
            setMessage("Marcación registrada en la vista de prueba");
          }}
        />
      )}
    </ModulePage>
  );
}
