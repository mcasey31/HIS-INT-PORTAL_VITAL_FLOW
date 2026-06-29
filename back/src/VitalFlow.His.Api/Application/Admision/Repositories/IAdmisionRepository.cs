namespace VitalFlow.His.Api.Application.Admision.Repositories;

public interface IAdmisionRepository
{
    // ── turno_admision ──────────────────────────────────────────────────────

    /// Devuelve la fila de admision para el turnoId dado, o null si no existe aun.
    TurnoAdmisionRow? GetTurnoAdmision(string turnoId);

    /// Carga en lote todas las filas cuyo turno_id este en la lista (para BuscarTurnos).
    IReadOnlyDictionary<string, TurnoAdmisionRow> GetTurnosAdmisionByIds(IReadOnlyList<string> turnoIds);

    /// Insert or update de la fila completa. llegada_en nunca se sobreescribe si ya tenia valor.
    void UpsertTurnoAdmision(TurnoAdmisionRow row);

    /// Devuelve los turnoIds que tienen el estado indicado (excluye excludeTurnoId).
    IReadOnlyList<string> GetTurnosEnEstado(string estado, string? excludeTurnoId = null);

    /// Devuelve turnos programados asignados (modulo Turnos) para una fecha, con datos de paciente y cobertura vigente.
    IReadOnlyList<TurnoProgramadoPacienteRow> GetTurnosProgramadosPacientePorFecha(DateOnly fecha);

    // ── encuentro ───────────────────────────────────────────────────────────

    /// Devuelve el encuentro del turno dado, o null si no existe.
    EncuentroRow? GetEncuentroPorTurno(string turnoId);

    /// Crea el encuentro si no existe. Devuelve el encuentroId (nuevo o preexistente).
    string CrearEncuentroSiNoExiste(string turnoId, string pacienteId);

    /// Cierra el encuentro (estado ABIERTO → CERRADO). Devuelve la fila cerrada o null si ya estaba cerrado.
    EncuentroRow? CerrarEncuentro(string turnoId, string motivoCierre);

    /// Lista de (turnoId, encuentroId) para encuentros abiertos creados antes de limite.
    IReadOnlyList<(string TurnoId, string EncuentroId)> GetEncuentrosAbiertosAntesDe(DateTimeOffset limite);

    // ── clearing ────────────────────────────────────────────────────────────

    /// Devuelve los turnoIds en los estados indicados (para limpieza de huerfanos).
    IReadOnlyList<string> GetTurnosEnEstados(IReadOnlyList<string> estados);

    /// Crea un registro de ejecucion de clearing y devuelve su id.
    Guid CreateClearingLog(string? centroId, string modo, int progAusente, int salaNoAtend, int obsAtend, int pagoNoAdm, int total);

    /// Registra cada turno procesado en el detalle.
    void CreateClearingDetalle(Guid clearingId, string turnoId, string estadoAnterior, string estadoNuevo);

    /// Obtiene la fecha del ultimo clearing registrado.
    DateTimeOffset? GetUltimoClearingEjecutado();
}

/// Fila de la tabla sch_admision.turno_admision.
public sealed record TurnoAdmisionRow(
    string TurnoId,
    string? PacienteId,
    string? PacienteNombre,
    string? Documento,
    string? Financiador,
    string Estado,
    string EstadoTurno,
    string? Motivo,
    DateTimeOffset? LlegadaEn
);

public sealed record TurnoProgramadoPacienteRow(
    string TurnoProgramadoId,
    string PacienteId,
    string PacienteNombre,
    string Documento,
    string Financiador,
    string Servicio,
    string Profesional,
    DateTimeOffset FechaHora
);

/// Fila de la tabla sch_admision.encuentro.
public sealed record EncuentroRow(
    string EncuentroId,
    string TurnoId,
    string PacienteId,
    string Estado,
    DateTimeOffset CreadoEn,
    DateTimeOffset? CerradoEn,
    string? MotivoCierre
);
