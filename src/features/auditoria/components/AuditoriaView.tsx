import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ModulePage from "@/components/modules/ModulePage";
import ModuleSelect from "@/components/modules/ModuleSelect";
import { moduleDate } from "@/components/modules/module.utils";
import DataTable from "@/components/data-table/DataTable";
import type { DataTableFeatures } from "@/components/data-table/data-table.config";
import { AUDITORIA_MOCK } from "../data/auditoria.mock";
import type { AuditListado } from "../types/auditoria.types";
import AuditDetailDialog from "./AuditDetailDialog";

const column = createColumnHelper<DataTableFeatures, AuditListado>();

/** Permite consultar la actividad de ejemplo con los filtros del backend */
export default function AuditoriaView() {
  const [filters, setFilters] = useState({
    tabla: "todos",
    accion: "todos",
    usuario: "todos",
    registro: "",
  });
  const [selected, setSelected] = useState<AuditListado | null>(null);
  const users = [
    ...new Map(
      AUDITORIA_MOCK.map((item) => [
        item.usuario_id,
        { value: item.usuario_id, label: item.usuarios.email },
      ]),
    ).values(),
  ];
  const filtered = AUDITORIA_MOCK.filter(
    (item) =>
      (filters.tabla === "todos" || item.tabla_afectada === filters.tabla) &&
      (filters.accion === "todos" || item.accion === filters.accion) &&
      (filters.usuario === "todos" || item.usuario_id === filters.usuario) &&
      (!filters.registro || item.registro_id === filters.registro.trim()),
  );
  const columns = column.columns([
    column.accessor("created_at", {
      header: "Fecha y hora",
      cell: ({ getValue }) => moduleDate(getValue()),
    }),
    column.accessor("usuarios.email", {
      header: "Usuario",
      cell: ({ row }) => (
        <div>
          <p>{row.original.usuarios.email}</p>
          <p className="mt-1 text-muted-foreground">
            {row.original.usuarios.rol}
          </p>
        </div>
      ),
    }),
    column.accessor("accion", {
      header: "Acción",
      cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
    }),
    column.accessor("tabla_afectada", { header: "Tabla" }),
    column.accessor("registro_id", {
      header: "Registro",
      cell: ({ getValue }) => (
        <span className="font-mono text-[10px]">{getValue()}</span>
      ),
    }),
    column.accessor("direccion_ip", { header: "IP" }),
    column.display({
      id: "detalle",
      header: "Detalle",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setSelected(row.original)}
        >
          Ver cambios
        </Button>
      ),
    }),
  ]);
  const setFilter = (key: keyof typeof filters, value: string): void =>
    setFilters((current) => ({ ...current, [key]: value }));
  return (
    <ModulePage
      title="Auditoría"
      description="Consulta el historial de operaciones y los valores modificados"
    >
      <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ModuleSelect
          label="Tabla"
          value={filters.tabla}
          onChange={(value) => setFilter("tabla", value)}
          items={[
            { value: "todos", label: "Todas" },
            ...["empleados", "contrato", "solicitud"].map((value) => ({
              value,
              label: value,
            })),
          ]}
        />
        <ModuleSelect
          label="Acción"
          value={filters.accion}
          onChange={(value) => setFilter("accion", value)}
          items={[
            { value: "todos", label: "Todas" },
            ...["INSERT", "UPDATE"].map((value) => ({ value, label: value })),
          ]}
        />
        <ModuleSelect
          label="Usuario"
          value={filters.usuario}
          onChange={(value) => setFilter("usuario", value)}
          items={[{ value: "todos", label: "Todos" }, ...users]}
        />
        <Input
          aria-label="Filtrar por ID de registro"
          placeholder="ID del registro (UUID)"
          value={filters.registro}
          onChange={(event) => setFilter("registro", event.target.value)}
        />
      </div>
      <DataTable
        data={filtered}
        columns={columns}
        getRowId={(row) => row.id}
        caption="Operaciones de auditoría"
      />
      {selected && (
        <AuditDetailDialog
          registro={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </ModulePage>
  );
}
