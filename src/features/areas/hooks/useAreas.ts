import { useState } from "react";

import { areasMock } from "@/features/areas/data/areas.mock";
import type { AreaViewModel } from "@/features/areas/types/areas.types";

/**
 * Administra las áreas de ejemplo, la búsqueda y la paginación.
 * Los cambios se mantienen en memoria hasta recargar la página.
 */
export function useAreas() {
  const [areas, setAreas] = useState<AreaViewModel[]>(() =>
    areasMock.map((area) => ({ ...area })),
  );

  const [search, setSearchValue] = useState("");
  const [pageSize, setPageSizeValue] = useState(10);
  const [requestedPage, setRequestedPage] = useState(1);

  const normalizedSearch = search.trim().toLocaleLowerCase("es");

  const filteredAreas = areas.filter((area) => {
    const searchableText =
      `${area.nombre} ${area.descripcion ?? ""}`.toLocaleLowerCase("es");

    return searchableText.includes(normalizedSearch);
  });

  const activeAreasCount = areas.filter(
    (area) => area.isActive,
  ).length;

  const totalResults = filteredAreas.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAreas = filteredAreas.slice(
    startIndex,
    startIndex + pageSize,
  );

  const firstResult = totalResults === 0 ? 0 : startIndex + 1;
  const lastResult = Math.min(startIndex + pageSize, totalResults);

  function setSearch(value: string) {
    setSearchValue(value);
    setRequestedPage(1);
  }

  function setPageSize(value: number) {
    if (![5, 10, 20].includes(value)) return;

    setPageSizeValue(value);
    setRequestedPage(1);
  }

  function goToPage(page: number) {
    setRequestedPage(Math.max(1, Math.min(page, totalPages)));
  }

  return {
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
  };
}