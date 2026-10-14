import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Check, FileText, IdCard, UserRoundSearch } from "lucide-react";
import { CrearContratoSchema, EditarContratoSchema, RenovarContratoSchema, type ActualizarDatoFinancieroDto, type CrearDatoFinancieroDto, type EditarContratoDto } from "@jyp/shared-contracts";
import { ROUTE_PATHS } from "@/app/routes/path";
import { APP_PREVIEW_MODE } from "@/app/config/app-preview.config";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getContratosEmpleadoMock, getMarcacionesEmpleadoMock } from "@/features/empleados/data/ficha-empleado.mock";
import { getContratosMock } from "@/features/empleados/data/ficha-empleado.mock";
import { getFinancierosDetalleMock, crearFinancieroEmpleadoMock, editarFinancieroEmpleadoMock } from "@/features/empleados/data/financieros-empleado.mock";
import { crearContratoEmpleadoMock, editarContratoEmpleadoMock, renovarContratoEmpleadoMock, anularContratoEmpleadoMock } from "@/features/empleados/data/contratos-empleado.mock";
import { getJornadaEmpleadoMock } from "@/features/empleados/data/jornadas-empleado.mock";
import { addFichaDays, getFichaSemana } from "@/features/empleados/utils/ficha-empleado.utils";
import FichaEmpleadoHeader from "@/features/empleados/components/ficha/FichaEmpleadoHeader";
import EmpleadoInformacionTab from "@/features/empleados/components/ficha/EmpleadoInformacionTab";
import EmpleadoContratosTab from "@/features/empleados/components/ficha/EmpleadoContratosTab";
import EmpleadoAsistenciaTab from "@/features/empleados/components/ficha/EmpleadoAsistenciaTab";
import FichaEmptyState from "@/features/empleados/components/ficha/FichaEmptyState";
import ContratoEmpleadoDialog from "@/features/empleados/components/contratos/ContratoEmpleadoDialog";
import AnularContratoDialog from "@/features/empleados/components/contratos/AnularContratoDialog";
import FinancieroEmpleadoDialog from "@/features/empleados/components/financieros/FinancieroEmpleadoDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ContratoAction, ContratoFormDto } from "@/features/empleados/types/contrato-empleado.types";

/** Toma nuevas copias para mostrar los cambios realizados en los mocks */
function cargarFichaMock() {
  return { empleados: [...EMPLEADOS_MOCK], contratos: getContratosMock(), financieros: getFinancierosDetalleMock() };
}

/** Compone las tres pestañas de la ficha con las fuentes de prueba */
export default function FichaEmpleadoPage() {
  const { empleadoId } = useParams();
  // Cambiar de empleado reinicia los formularios y dialogos abiertos
  return <FichaEmpleadoContent key={empleadoId} empleadoId={empleadoId} />;
}

/** Coordina la consulta y las acciones de las pestañas de la ficha */
function FichaEmpleadoContent({ empleadoId }: { empleadoId?: string }) {
  const [params, setParams] = useSearchParams();
  const { session } = useAuth();
  const [data, setData] = useState(cargarFichaMock);
  const [contratoAction, setContratoAction] = useState<ContratoAction | null>(null);
  const [financieroOpen, setFinancieroOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const empleado = data.empleados.find((item) => item.id === empleadoId);
  const tabParam = params.get("tab");
  const tab = tabParam === "contratos" || tabParam === "asistencia" ? tabParam : "informacion";
  const semana = getFichaSemana(params.get("semana"));
  const canManage = APP_PREVIEW_MODE || session?.usuario.rol === "ADMIN" || session?.usuario.rol === "RRHH";
  const available = Boolean(empleado?.activo && !empleado.deleted_at);
  const canCreateFinanciero = (canManage || session?.usuario.rol === "CONTADOR") && Boolean(empleado && !empleado.deleted_at);
  const contratos = empleado ? getContratosEmpleadoMock(empleado.id, data.contratos) : [];
  const financiero = data.financieros.find((item) => item.empleado_id === empleadoId) ?? null;
  const jornada = empleado ? getJornadaEmpleadoMock(empleado.jornada_id) : null;
  const marcaciones = empleado ? getMarcacionesEmpleadoMock(empleado.id, semana, addFichaDays(semana, 6)) : [];

  const finishAction = (text: string): void => {
    setData(cargarFichaMock()); setMessage(text); setContratoAction(null); setFinancieroOpen(false);
  };
  const openContratoAction = (action: ContratoAction): void => { setMessage(null); setContratoAction(action); };
  const handleContrato = (values: ContratoFormDto["contrato"] | EditarContratoDto): void => {
    if (!empleado || !contratoAction || !canManage || !available) throw new Error("El empleado no está disponible para esta operación");
    if (contratoAction.type === "crear") crearContratoEmpleadoMock(CrearContratoSchema.parse({ ...values, empleado_id: empleado.id }));
    else if (contratoAction.type === "editar") editarContratoEmpleadoMock(contratoAction.contrato.id, EditarContratoSchema.parse(values));
    else if (contratoAction.type === "renovar") renovarContratoEmpleadoMock(contratoAction.contrato.id, RenovarContratoSchema.parse(values));
    finishAction(contratoAction.type === "renovar" ? "Contrato renovado en la vista de prueba" : "Contrato guardado en la vista de prueba");
  };
  const handleAnular = (): void => {
    if (contratoAction?.type !== "anular" || !canManage || !available) throw new Error("No se puede anular este contrato");
    anularContratoEmpleadoMock(contratoAction.contrato.id);
    finishAction("Contrato anulado en la vista de prueba");
  };
  const handleCrearFinanciero = (values: CrearDatoFinancieroDto): void => {
    if (!canCreateFinanciero) throw new Error("No tienes permiso para registrar datos financieros");
    crearFinancieroEmpleadoMock(values);
    finishAction("Datos financieros registrados en la vista de prueba");
  };
  const handleEditarFinanciero = (values: ActualizarDatoFinancieroDto): void => {
    if (!empleado || !canManage) throw new Error("No tienes permiso para editar datos financieros");
    editarFinancieroEmpleadoMock(empleado.id, values);
    finishAction("Datos financieros actualizados en la vista de prueba");
  };

  const changeTab = (value: unknown): void => {
    if (value !== "informacion" && value !== "contratos" && value !== "asistencia") return;
    const next = new URLSearchParams(params);
    next.set("tab", value);
    void setParams(next, { replace: true });
  };

  const changeWeek = (value: string): void => {
    const next = new URLSearchParams(params);
    next.set("semana", value);
    void setParams(next, { replace: true });
  };

  return (
    <section aria-labelledby="ficha-empleado-title" className="-m-4 min-h-full bg-[#faf9ff] p-4 dark:bg-background sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link to={ROUTE_PATHS.gestionPersonal.empleados} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"><ArrowLeft aria-hidden="true" className="size-3.5" /> Volver a empleados</Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h1 id="ficha-empleado-title" className="text-xl font-semibold text-foreground">Ficha de empleado</h1><p className="mt-1 text-xs text-muted-foreground">Información, contratos y asistencia del colaborador</p></div>
          <Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">Vista de prueba</Badge>
        </div>
        {!empleado ? <FichaEmptyState icon={UserRoundSearch} title="Empleado no encontrado" description="El registro solicitado no existe en los datos de prueba" /> : (
          <>
            <FichaEmpleadoHeader empleado={empleado} canManage={canManage} />
            {message && <Alert role="status" className="border-emerald-200 bg-emerald-50 text-emerald-700"><Check aria-hidden="true" /><AlertDescription className="text-emerald-700">{message}</AlertDescription></Alert>}
            <Tabs value={tab} onValueChange={changeTab} className="gap-5">
              <TabsList variant="line" aria-label="Secciones de la ficha" className="w-full justify-start border-b p-0 group-data-horizontal/tabs:h-auto">
                <TabsTrigger value="informacion" className="h-auto flex-none px-2 py-3 text-xs after:bg-primary data-active:text-primary group-data-horizontal/tabs:after:bottom-0 sm:px-4"><IdCard aria-hidden="true" className="hidden size-3.5 sm:block" />Información</TabsTrigger>
                <TabsTrigger value="contratos" className="h-auto flex-none px-2 py-3 text-xs after:bg-primary data-active:text-primary group-data-horizontal/tabs:after:bottom-0 sm:px-4"><FileText aria-hidden="true" className="hidden size-3.5 sm:block" />Contratos</TabsTrigger>
                <TabsTrigger value="asistencia" className="h-auto flex-none px-2 py-3 text-xs after:bg-primary data-active:text-primary group-data-horizontal/tabs:after:bottom-0 sm:px-4"><CalendarDays aria-hidden="true" className="hidden size-3.5 sm:block" />Asistencia</TabsTrigger>
              </TabsList>
              <TabsContent value="informacion"><EmpleadoInformacionTab empleado={empleado} financiero={financiero} canCreateFinanciero={canCreateFinanciero} canEditFinanciero={canManage} onManageFinanciero={() => { setMessage(null); setFinancieroOpen(true); }} /></TabsContent>
              <TabsContent value="contratos"><EmpleadoContratosTab contratos={contratos} available={available} canManage={canManage} onCreate={() => openContratoAction({ type: "crear" })} onEdit={(contrato) => openContratoAction({ type: "editar", contrato })} onRenew={(contrato) => openContratoAction({ type: "renovar", contrato })} onCancel={(contrato) => openContratoAction({ type: "anular", contrato })} /></TabsContent>
              <TabsContent value="asistencia"><EmpleadoAsistenciaTab empleado={empleado} jornada={jornada} marcaciones={marcaciones} semana={semana} onWeekChange={changeWeek} /></TabsContent>
            </Tabs>
            {contratoAction && contratoAction.type !== "anular" && <ContratoEmpleadoDialog mode={contratoAction.type} contrato={contratoAction.type === "crear" ? undefined : contratoAction.contrato} onClose={() => setContratoAction(null)} onSubmit={handleContrato} />}
            {contratoAction?.type === "anular" && <AnularContratoDialog contrato={contratoAction.contrato} onClose={() => setContratoAction(null)} onConfirm={handleAnular} />}
            {financieroOpen && <FinancieroEmpleadoDialog empleadoId={empleado.id} financiero={financiero} onClose={() => setFinancieroOpen(false)} onCreate={handleCrearFinanciero} onEdit={handleEditarFinanciero} />}
          </>
        )}
      </div>
    </section>
  );
}
