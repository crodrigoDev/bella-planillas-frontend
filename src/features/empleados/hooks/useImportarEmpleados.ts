import { useEffect, useState } from "react";
import { avanzarImportacionMock, confirmarImportacionMock, validarImportacionMock } from "../data/importar-empleados.mock";
import { crearArchivoImportacionEjemplo, getImportacionFileError } from "../utils/importar-empleados.utils";
import type { EscenarioImportacion, ReporteImportacion, TrabajoImportacion } from "../types/importar-empleados.types";

/** Coordina la seleccion, revision y seguimiento de la importacion de prueba */
export function useImportarEmpleados() {
  const [file, setFile] = useState<File | null>(null);
  const [scenario, setScenario] = useState<EscenarioImportacion>("correcto");
  const [report, setReport] = useState<ReporteImportacion | null>(null);
  const [job, setJob] = useState<TrabajoImportacion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stage = job ? 2 : report ? 1 : 0;
  const isProcessing = job?.estado === "EN_COLA" || job?.estado === "PROCESANDO";

  useEffect(() => {
    if (!job || !report || !isProcessing) return;
    // Simula el avance del trabajo y detiene el temporizador al salir de la pagina
    const timer = window.setTimeout(() => {
      setJob(avanzarImportacionMock(job, report.filas_validas_data, scenario));
    }, 550);
    return () => window.clearTimeout(timer);
  }, [job, report, scenario, isProcessing]);

  const chooseFile = (nextFile: File): void => {
    const message = getImportacionFileError(nextFile);
    setError(message);
    setFile(message ? null : nextFile);
    setReport(null);
  };

  const loadExample = (): void => chooseFile(crearArchivoImportacionEjemplo(scenario));

  const validate = (): void => {
    if (!file) {
      setError("Selecciona un archivo antes de continuar");
      return;
    }
    setError(null);
    setReport(validarImportacionMock(scenario));
  };

  const confirm = (): void => {
    if (!report?.filas_validas_data.length) return;
    setError(null);
    setJob(confirmarImportacionMock({ filas_validas_data: report.filas_validas_data }));
  };

  const back = (): void => {
    setReport(null);
    setError(null);
  };

  const reset = (): void => {
    setFile(null);
    setReport(null);
    setJob(null);
    setError(null);
  };

  return { file, scenario, setScenario, report, job, error, stage, isProcessing, chooseFile, loadExample, validate, confirm, back, reset };
}
