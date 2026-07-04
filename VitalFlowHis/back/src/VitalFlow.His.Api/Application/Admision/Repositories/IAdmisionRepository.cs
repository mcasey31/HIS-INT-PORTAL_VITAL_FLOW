namespace VitalFlow.His.Api.Application.Admision.Repositories;

public interface IAdmisionRepository
{
    // ── catalogos de admision ──────────────────────────────────────────────

    /// Devuelve estados de admision activos ordenados por prioridad.
    IReadOnlyList<string> GetEstadosAdmisionActivos();

    /// Devuelve true si la transicion entre estados esta permitida y activa.
    bool IsTransicionAdmisionPermitida(string estadoActual, string nuevoEstado);

    /// Devuelve true si el estado de admision es final.
    bool IsEstadoAdmisionFinal(string estado);

    /// Devuelve el estado de admision para una accion parametrizada.
    string ResolveEstadoAdmisionByAccion(string accionCodigo);

    /// Devuelve el estado de turno para una accion parametrizada.
    string ResolveEstadoTurnoByAccion(string accionCodigo);

    /// Devuelve el estado de turno mapeado para un estado de admision.
    string ResolveEstadoTurnoByEstadoAdmision(string estadoAdmision);

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

    /// Devuelve la cobertura vigente del paciente (financiador + plan) o null si no existe.
    CoberturaPacienteRow? GetCoberturaVigentePaciente(Guid pacienteId);

    // ── encuentro ───────────────────────────────────────────────────────────

    /// Devuelve el encuentro del turno dado, o null si no existe.
    EncuentroRow? GetEncuentroPorTurno(string turnoId);

    /// Crea el encuentro si no existe. Devuelve el encuentroId (nuevo o preexistente).
    string CrearEncuentroSiNoExiste(string turnoId, string pacienteId);

    /// Cierra el encuentro (estado ABIERTO → CERRADO). Devuelve la fila cerrada o null si ya estaba cerrado.
    EncuentroRow? CerrarEncuentro(string turnoId, string motivoCierre);

    /// Lista de (turnoId, encuentroId) para encuentros abiertos creados antes de limite.
    IReadOnlyList<(string TurnoId, string EncuentroId)> GetEncuentrosAbiertosAntesDe(DateTimeOffset limite);

    // ── módulos HIS / outbox facturación ────────────────────────────────────

    /// Devuelve true si el modulo opcional esta activo en sch_admision.modulos_his.
    bool IsModuloHisActivo(string codigo);

    /// Inserta un evento en el outbox de facturacion. Idempotente: si ya hay un PENDIENTE para el turno, no inserta.
    void InsertEventoFacturacionOutbox(EventoFacturacionOutboxRow row);

    /// Resuelve homologacion de práctica HIS contra catálogo de facturación por contexto de cobertura.
    HomologacionPracticaFacturacionRow? ResolveHomologacionPractica(string practicaOrigenCodigo, Guid? financiadorId, Guid? planId);

    /// Devuelve el ultimo evento de facturacion para el turno dado, o null si no existe.
    EventoFacturacionEstadoRow? GetEventoFacturacionByTurnoId(string turnoId);
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

public sealed record CoberturaPacienteRow(
    Guid FinanciadorId,
    Guid PlanId,
    string? FinanciadorNombre,
    string? PlanNombre
);

/// Fila para el outbox sch_admision.eventos_facturacion_outbox.
public sealed record EventoFacturacionOutboxRow(
    Guid Id,
    string TurnoId,
    Guid? EncuentroId,
    Guid PacienteId,
    string PacienteNombre,
    string Documento,
    string? Financiador,
    Guid? FinanciadorId,
    Guid? PlanId,
    string? ServicioNombre,
    Guid? CentroId,
    DateTimeOffset LlegadaEn,
    string Payload,
    // Práctica asistencial obligatoria — nulos sólo si el caller no la conoce aún
    string? PracticaOrigenNombre = null,
    string? PracticaOrigenCodigo = null,
    bool HomologacionEncontrada = false,
    string? CatalogoDestinoCodigo = null,
    string? PrestacionDestinoCodigo = null,
    string? PrestacionDestinoNombre = null,
    Guid? ProfesionalId = null,
    string? ProfesionalNombre = null,
    string TipoOrigen = "TURNO",
    string EventType = "ADMISION_EN_SALA_ESPERA"
);

public sealed record HomologacionPracticaFacturacionRow(
    string CatalogoCodigo,
    string PrestacionCodigo,
    string? PrestacionNombre
);

public sealed record EventoFacturacionEstadoRow(
    string TurnoId,
    string Estado,
    string? ErrorDetalle,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ProcessedAt
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
