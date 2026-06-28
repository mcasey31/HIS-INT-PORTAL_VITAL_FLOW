export type AgendaSummary = {
  id: string;
  codigo: string;
  nombre: string;
  centroId: string;
  centro: string;
  servicioId: string;
  servicio: string;
  tipoEfector: string;
  efectorId: string;
  efector: string;
  tipoAgenda: string;
  visibleContactCenter: boolean;
  activa: boolean;
  fechaDesde: string;
  fechaHasta?: string;
  observacion?: string;
  bloques: number;
  bloqueos: number;
};

export type BloquePractica = {
  nombre: string;
  duracionMinutos: number;
};

export type AgendaDetailBloque = {
  id: string;
  nombre: string;
  tipoBloque: string;
  fechaDesde: string;
  fechaHasta: string;
  atiendeFeriados: boolean;
  dias: string[];
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracionTurnoMinutos: number;
  intervaloMinutos: number;
  lugarAtencionId: string;
  lugarAtencionNombre: string;
  frecuencia: string;
  ordenMensualSemanas: number[];
  practicas: BloquePractica[];
  sobreturnos: number;
  activo: boolean;
};

export type AgendaDetail = {
  id: string;
  codigo: string;
  nombre: string;
  centroId: string;
  centro: string;
  servicioId: string;
  servicio: string;
  tipoEfector: string;
  efectorId: string;
  efector: string;
  tipoAgenda: string;
  visibleContactCenter: boolean;
  activa: boolean;
  fechaDesde: string;
  fechaHasta?: string;
  observacion?: string;
  bloques: AgendaDetailBloque[];
  bloqueos: {
    id: string;
    inicio: string;
    fin: string;
    tipo: string;
  }[];
};

export type CreateAgendaRequest = {
  nombre: string;
  centroId: string;
  servicioId: string;
  tipoEfector: string;
  efectorId: string;
  tipoAgenda: string;
  visibleContactCenter: boolean;
  fechaDesde: string;
  fechaHasta?: string;
  observacion?: string;
};

export type UpdateAgendaRequest = {
  codigo: string;
  nombre: string;
  centroId: string;
  servicioId: string;
  tipoEfector: string;
  efectorId: string;
  tipoAgenda: string;
  visibleContactCenter: boolean;
  fechaDesde: string;
  fechaHasta?: string;
  observacion?: string;
};

export type SelectorOption = {
  id: string;
  nombre: string;
};

export type EfectorOption = {
  id: string;
  nombre: string;
  tipoEfector: string;
};

export type CopyAgendaRequest = {
  codigo: string;
  nombre: string;
  fechaDesde: string;
  fechaHasta?: string;
};

export type CreateBloqueRequest = {
  nombre: string;
  tipoBloque: string;
  fechaDesde: string;
  fechaHasta: string;
  atiendeFeriados: boolean;
  dias: string[];
  horaInicio: string;
  horaFin: string;
  duracionTurnoMinutos: number;
  lugarAtencionId: string;
  frecuencia: string;
  ordenMensualSemanas: number[];
  practicas?: BloquePracticaRequest[];
  sobreturnos: number;
};

export type BloquePracticaRequest = {
  nombre: string;
  duracionMinutos?: number;
};

export type DiaSemanaOption = {
  codigo: string;
  nombre: string;
};

export type PracticaOption = {
  nombre: string;
  duracionMinutosSugerida?: number;
};

export type UpdateBloqueRequest = {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  intervaloMinutos: number;
};

export type CreateBloqueoRequest = {
  inicio: string;
  fin: string;
  tipo: string;
};

export type DisponibilidadResponse = {
  agendaId: string;
  cuposTotales: number;
  cuposDisponibles: number;
  bloqueosActivos: number;
};

export type TurnoACancelar = {
  turnoId: string;
  paciente: string;
  fechaHora: string;
  estado: string;
};

export type CreateGrupoProfesionalMiembroRequest = {
  efectorId: string;
  rol?: string;
  orden?: number;
};

export type CreateGrupoProfesionalRequest = {
  codigo: string;
  nombre: string;
  centroId: string;
  servicioId: string;
  descripcion?: string;
  miembros: CreateGrupoProfesionalMiembroRequest[];
};

export type GrupoProfesionalResponse = {
  id: string;
  codigo: string;
  nombre: string;
  centroId: string;
  centro: string;
  servicioId: string;
  servicio: string;
  descripcion?: string;
  activo: boolean;
  miembros: {
    id: string;
    efectorId: string;
    efector: string;
    rol?: string;
    orden?: number;
    activo: boolean;
  }[];
};
