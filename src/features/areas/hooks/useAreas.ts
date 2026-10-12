import { useState } from "react";
import { areasMock } from "@/features/areas/data/areas.mock";
import type { AreaViewModel } from "@/features/areas/types/areas.types";

export function useAreas() {
  const [areas, setAreas] = useState<AreaViewModel[]>(() =>
    areasMock.map((area) => ({ ...area })),
  );
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLocaleLowerCase("es");

  const filteredAreas = areas.filter((area) => {
    const searchableText =
      `${area.nombre} ${area.descripcion ?? ""}`.toLocaleLowerCase("es");

    return searchableText.includes(normalizedSearch);
  });

  const activeAreasCount = areas.filter((area) => area.isActive).length;

  return {
    areas,
    setAreas,
    search,
    setSearch,
    filteredAreas,
    activeAreasCount,
  };
}