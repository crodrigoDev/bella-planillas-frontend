import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import type { CrearAreaDto } from "@jyp/shared-contracts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AreaActions } from "@/features/areas/components/AreaActions";
import { AreaDeactivateDialog } from "@/features/areas/components/AreaDeactivateDialog";
import { AreaFormDialog } from "@/features/areas/components/AreaFormDialog";
import { useAreas } from "@/features/areas/hooks/useAreas";
import type { AreaViewModel } from "@/features/areas/types/areas.types";

/**
 * Compone la gestión de áreas con datos mockeados.
 * Permite buscar, paginar, registrar, editar y desactivar registros.
 */
export function AreasView() {
  const {
    areas,
    setAreas,
    search,
    setSearch,
    activeAreasCount,
    paginatedAreas,
    pageSize,
    setPageSize,
    currentPage,
    totalPages,
    totalResults,
    firstResult,
    lastResult,
    goToPage,
  } = useAreas();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArea, setSelectedArea] =
    useState<AreaViewModel | undefined>(undefined);
  const [deactivationArea, setDeactivationArea] =
    useState<AreaViewModel | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState("");

  function handleOpenCreate() {
    setSelectedArea(undefined);
    setSuccessMessage("");
    setIsFormOpen(true);
  }

  function handleOpenEdit(area: AreaViewModel) {
    setSelectedArea(area);
    setSuccessMessage("");
    setIsFormOpen(true);
  }

  function handleSaveArea(values: CrearAreaDto) {
    if (selectedArea) {
      setAreas((currentAreas) =>
        currentAreas.map((area) =>
          area.id === selectedArea.id
            ? {
                ...area,
                nombre: values.nombre,
                descripcion: values.descripcion,
              }
            : area,
        ),
      );

      setSuccessMessage(
        `El área "${values.nombre}" se actualizó correctamente.`,
      );

      setSearch("");
    } else {
      setAreas((currentAreas) => [
        {
          id: crypto.randomUUID(),
          nombre: values.nombre,
          descripcion: values.descripcion,
          activeEmployees: 0,
          activePositions: 0,
          associatedSchedules: 0,
          isActive: true,
        },
        ...currentAreas,
      ]);

      setSearch("");
      setSuccessMessage(
        `El área "${values.nombre}" se registró correctamente.`,
      );
    }
  }

  function handleRequestDeactivate(area: AreaViewModel) {
    if (!area.isActive) return;

    setSuccessMessage("");
    setDeactivationArea(area);
  }

  function handleConfirmDeactivate() {
    if (!deactivationArea) return;

    const currentArea = areas.find(
      (area) => area.id === deactivationArea.id,
    );

    if (
      !currentArea ||
      !currentArea.isActive ||
      currentArea.activeEmployees > 0 ||
      currentArea.activePositions > 0
    ) {
      return;
    }

    setAreas((currentAreas) =>
      currentAreas.map((area) =>
        area.id === currentArea.id
          ? { ...area, isActive: false }
          : area,
      ),
    );

    setSuccessMessage(
      `El área "${currentArea.nombre}" se desactivó correctamente.`,
    );
    setDeactivationArea(undefined);
  }

  return (
    <section className="space-y-6 p-4 md:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Áreas
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Administra las áreas de la empresa
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="h-11 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus aria-hidden="true" className="size-4" />
          Registrar área
        </Button>
      </header>

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        >
          {successMessage}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            aria-label="Buscar áreas por nombre o descripción"
            placeholder="Buscar por nombre o descripción…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 pl-10"
          />
        </div>

        <Badge variant="secondary" className="w-fit px-3 py-1.5">
          {activeAreasCount} áreas activas
        </Badge>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-5 py-4">
                Nombre
              </TableHead>
              <TableHead className="min-w-64">
                Descripción breve
              </TableHead>
              <TableHead className="text-center">
                Empleados activos
              </TableHead>
              <TableHead className="text-center">
                Cargos activos
              </TableHead>
              <TableHead className="text-center">
                Jornadas asociadas
              </TableHead>
              <TableHead className="px-5 text-center">
                Estado
              </TableHead>
              <TableHead className="px-5 text-center">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedAreas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <p className="font-medium">
                    {search.trim()
                      ? "No se encontraron áreas"
                      : "Todavía no hay áreas registradas"}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {search.trim()
                      ? "Prueba con otro nombre o descripción."
                      : "Registra un área para comenzar."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAreas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="min-w-64 whitespace-normal px-5 py-6 font-medium">
                    {area.nombre}
                  </TableCell>

                  <TableCell className="max-w-80 whitespace-normal text-muted-foreground">
                    {area.descripcion || "Sin descripción"}
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={
                        area.activeEmployees > 0
                          ? "inline-flex size-9 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                          : "text-muted-foreground"
                      }
                    >
                      {area.activeEmployees}
                    </span>
                  </TableCell>

                  <TableCell className="text-center text-muted-foreground">
                    {area.activePositions}
                  </TableCell>

                  <TableCell className="text-center text-muted-foreground">
                    {area.associatedSchedules}
                  </TableCell>

                  <TableCell className="px-5 text-center">
                    <Badge
                      variant="outline"
                      className={
                        area.isActive
                          ? "gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "gap-1.5 border-border bg-muted text-muted-foreground"
                      }
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-current"
                      />
                      {area.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 text-center">
                    <AreaActions
                      area={area}
                      onEdit={handleOpenEdit}
                      onDeactivate={handleRequestDeactivate}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <footer className="flex flex-col gap-4 border-t px-5 py-4 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p role="status" className="text-muted-foreground">
            Mostrando {firstResult}-{lastResult} de {totalResults} áreas
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                Registros por página:
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={`Registros por página: ${pageSize}`}
                  className="inline-flex h-9 items-center gap-2 rounded-md border px-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {pageSize}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {[5, 10, 20].map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => setPageSize(size)}
                    >
                      {size} registros
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <nav
              aria-label="Paginación de áreas"
              className="flex items-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
                Anterior
              </Button>

              <span
                aria-current="page"
                className="inline-flex h-9 min-w-9 items-center justify-center rounded-md bg-indigo-600 px-2 font-medium text-white"
              >
                {currentPage}
              </span>

              <span className="text-muted-foreground">
                de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Siguiente
                <ChevronRight aria-hidden="true" className="size-4" />
              </Button>
            </nav>
          </div>
        </footer>
      </div>

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
    </section>
  );
}