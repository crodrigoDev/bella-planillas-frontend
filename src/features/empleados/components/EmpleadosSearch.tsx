import { useEffect, useRef, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { ROUTE_PATHS } from "@/app/routes/path";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

/** Lleva la busqueda al listado de empleados y permite enfocarla con Ctrl K */
export default function EmpleadosSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const empleadosPath = ROUTE_PATHS.gestionPersonal.empleados;
  const currentSearch =
    pathname === empleadosPath
      ? (new URLSearchParams(search).get("search") ?? "")
      : "";

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const handleSearch = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const term = inputRef.current?.value.trim() ?? "";

    // Conserva los filtros del listado al buscar desde el header
    const params = new URLSearchParams(
      pathname === empleadosPath ? search : "",
    );
    if (term) params.set("search", term);
    else params.delete("search");
    params.delete("page");
    params.delete("limit");

    // El listado comparte este valor para filtrar sus empleados
    void navigate({ pathname: empleadosPath, search: `?${params.toString()}` });
  };

  return (
    <form
      role="search"
      aria-label="Buscar empleados"
      onSubmit={handleSearch}
      className="order-last w-full min-w-0 transition-[width] duration-200 ease-out motion-reduce:transition-all md:order-0 md:w-64 md:max-w-[50%] md:focus-within:w-80 lg:w-70 lg:focus-within:w-96"
    >
      <InputGroup className="h-9 bg-slate-50/80 text-slate-400 dark:bg-muted/50">
        <InputGroupAddon className="pl-2.5">
          <InputGroupButton
            type="submit"
            size="icon-xs"
            aria-label="Buscar empleado"
            title="Buscar empleado"
          >
            <Search aria-hidden="true" className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          key={currentSearch}
          ref={inputRef}
          type="search"
          name="search"
          defaultValue={currentSearch}
          placeholder="Buscar empleado por nombre"
          aria-label="Nombre, apellido, documento o correo del empleado"
          aria-keyshortcuts="Control+k Meta+k"
          autoComplete="off"
          className="min-w-0 text-foreground placeholder:text-slate-400 md:text-xs"
          onKeyDown={(event) => {
            if (event.key === "Escape") event.currentTarget.blur();
          }}
        />
        <InputGroupAddon align="inline-end" className="hidden md:flex">
          <kbd className="rounded border bg-background px-1 py-0.5 text-[10px]">
            Ctrl K
          </kbd>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
