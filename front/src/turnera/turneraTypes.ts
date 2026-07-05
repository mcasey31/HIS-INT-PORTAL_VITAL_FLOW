export type DisplayTurnoResponse = {
  id: string;
  paciente: string;
  documento: string;
  llegada: string | null;
  estado: string;
  servicio: string;
  efector: string;
};

export type DisplayTurneraResponse = {
  salaEspera: DisplayTurnoResponse[];
  enAtencion: DisplayTurnoResponse[];
  ultimoLlamado: DisplayTurnoResponse | null;
};

export type LlamarPacienteTurneraResponse = {
  ok: boolean;
  paciente: string;
  estado: string;
};

export type UltimoLlamadoTurneraResponse = {
  paciente: string | null;
  documento: string | null;
  estado: string | null;
};

export type KioscoArriboRequest = {
  documento: string;
  centroId: string;
};

export type KioscoArriboResponse = {
  ok: boolean;
  mensaje: string | null;
  paciente: string | null;
  turnoId: string | null;
};

export const ESTADOS_TURNERA = {
  EN_SALA_DE_ESPERA: "EN_SALA_DE_ESPERA",
  EN_ATENCION: "EN_ATENCION",
} as const;

export const POLL_INTERVAL_MS = 5000;
