import { httpClient } from "../shared/httpClient";

export type SelectorAdmision = {
  id: string;
  nombre: string;
};

export type PracticaAdmision = {
  id: string;
  nombre: string;
  servicioId: string;
};

export type EfectorAdmision = {
  id: string;
  nombre: string;
  tipoEfector: string;
  servicioId: string;
};

export type SelectoresAdmision = {
  servicios: SelectorAdmision[];
  practicas: PracticaAdmision[];
  tiposEfector: string[];
  efectores: EfectorAdmision[];
  estados: string[];
};

export type BuscarTurnosAdmisionRequest = {
  servicioId?: string;
  practicaId?: string;
  tipoEfector?: string;
  efectorId?: string;
  fecha?: string;
  estado?: string;
};

export type TurnoAdmision = {
  id: string;
  turno: string;
  llegada: string | null;
  paciente: string;
  documento: string;
  financiador: string;
  servicio: string;
  efector: string;
  estado: string;
  estadoTurno?: string;
};

export type ConfirmarArriboTurnoResponse = {
  turnoId: string;
  estado: string;
  llegada: string;
  estadoTurno?: string;
  encuentroId?: string | null;
  facturacionEventoEstado?: string | null;
  facturacionEventoDetalle?: string | null;
};

export type EventoFacturacionTurnoResponse = {
  turnoId: string;
  estado: string;
  errorDetalle?: string | null;
  createdAt?: string | null;
  processedAt?: string | null;
};



export type FinanciadorPlanAdmision = {
  id: string;
  financiador: string;
  plan: string;
  numeroAfiliado?: string;
  vigente: boolean;
  financiadorId: string | null;
  planId: string | null;
};

export type PacienteIdentificadoAdmision = {
  id: string;
  apellidosNombres: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexoBiologico: string;
  elegibilidadVerificada: boolean;
  financiadores: FinanciadorPlanAdmision[];
};

export type ConfirmarArriboTurnoRequest = {
  pacienteId: string;
  paciente: string;
  documento: string;
  financiador: string;
  documentacionValidada?: boolean;
  requierePago?: boolean;
  pagoRegistrado?: boolean;
  practicaCienPorcientoConvenida?: boolean;
  financiadorId?: string;
  planId?: string;
  servicioNombre?: string;
  centroId?: string;
  /** Práctica asistencial del turno — propagada al outbox de facturación. */
  practicaOrigenNombre?: string;
  practicaOrigenCodigo?: string;
  profesionalId?: string;
  profesionalNombre?: string;
  tipoOrigen?: string;
};

export type ActualizarEstadoTurnoRequest = {
  estado: string;
  motivo?: string;
};

export type ActualizarEstadoTurnoResponse = {
  turnoId: string;
  estado: string;
  motivo?: string | null;
};

export type EncuentroAdmisionResponse = {
  encuentroId: string;
  turnoId: string;
  pacienteId: string;
  estado: string;
  creadoEn: string;
  cerradoEn?: string | null;
  motivoCierre?: string | null;
};

export type CerrarEncuentroRequest = {
  estadoPacienteFinal: "ATENDIDO" | "NO_ATENDIDO";
  motivo?: string;
};

export type CerrarEncuentroResponse = {
  encuentroId: string;
  turnoId: string;
  estadoEncuentro: string;
  estadoPacienteFinal: string;
  cerradoEn: string;
  motivo?: string | null;
};

export async function getSelectoresAdmision(): Promise<SelectoresAdmision> {
  return httpClient.get<SelectoresAdmision>(`/api/v1/admision/landing/selectores`);
}



export async function identificarPacienteAdmision(
  tipoDocumento: string,
  numeroDocumento: string
): Promise<PacienteIdentificadoAdmision[]> {
  const params = new URLSearchParams({ tipoDocumento, numeroDocumento });
  return httpClient.get<PacienteIdentificadoAdmision[]>(`/api/v1/turnos/identificacion/paciente?${params.toString()}`);
}

export async function buscarTurnosAdmision(
  request: BuscarTurnosAdmisionRequest
): Promise<TurnoAdmision[]> {
  return httpClient.post<TurnoAdmision[]>(`/api/v1/admision/landing/buscar`, request);
}

export async function confirmarArriboTurno(
  turnoId: string,
  request: ConfirmarArriboTurnoRequest
): Promise<ConfirmarArriboTurnoResponse> {
  return httpClient.post<ConfirmarArriboTurnoResponse>(`/api/v1/admision/turnos/${encodeURIComponent(turnoId)}/arribo`, request);
}

export async function actualizarEstadoTurno(
  turnoId: string,
  request: ActualizarEstadoTurnoRequest
): Promise<ActualizarEstadoTurnoResponse> {
  return httpClient.post<ActualizarEstadoTurnoResponse>(`/api/v1/admision/turnos/${encodeURIComponent(turnoId)}/estado`, request);
}

export async function obtenerEncuentroTurno(
  turnoId: string
): Promise<EncuentroAdmisionResponse> {
  return httpClient.get<EncuentroAdmisionResponse>(`/api/v1/admision/turnos/${encodeURIComponent(turnoId)}/encuentro`);
}

export async function cerrarEncuentroTurno(
  turnoId: string,
  request: CerrarEncuentroRequest
): Promise<CerrarEncuentroResponse> {
  return httpClient.post<CerrarEncuentroResponse>(`/api/v1/admision/turnos/${encodeURIComponent(turnoId)}/encuentro/cerrar`, request);
}

export async function obtenerEventoFacturacionTurno(
  turnoId: string
): Promise<EventoFacturacionTurnoResponse> {
  return httpClient.get<EventoFacturacionTurnoResponse>(`/api/v1/admision/turnos/${encodeURIComponent(turnoId)}/facturacion-evento`);
}
