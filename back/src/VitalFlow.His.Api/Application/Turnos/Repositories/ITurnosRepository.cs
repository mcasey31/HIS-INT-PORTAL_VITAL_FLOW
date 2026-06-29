namespace VitalFlow.His.Api.Application.Turnos.Repositories;

public interface ITurnosRepository
{
    // ── paciente_financiador_plan ───────────────────────────────────────────

    /// Devuelve financiadores/planes vigentes asociados al paciente.
    IReadOnlyList<PacienteFinanciadorPlanRow> GetFinanciadoresVigentesPaciente(Guid pacienteId);

    /// Da de alta automatica como paciente con financiador privado particular por defecto.
    void EnsurePacienteConCoberturaPrivadaPorDefecto(Guid pacienteId);

    /// Inserta una nueva cobertura vigente para el paciente y opcionalmente finaliza una anterior.
    PacienteFinanciadorPlanRow GuardarFinanciadorPaciente(Guid pacienteId, Guid financiadorId, Guid planId, string? numeroAfiliado, Guid? reemplazarFinanciadorPlanId);

    /// Finaliza vigencia de una cobertura puntual del paciente.
    void FinalizarVigenciaFinanciadorPaciente(Guid pacienteId, Guid financiadorPlanPacienteId);

    // ── turno_paciente ──────────────────────────────────────────────────────

    /// Devuelve todos los turnos del paciente ordenados por fecha_hora.
    IReadOnlyList<TurnoPacienteRow> GetTurnosPorPaciente(string pacienteId);

    /// Devuelve turnos AGENDADOS de una fecha para validar ocupacion de slots en disponibilidad.
    IReadOnlyList<TurnoPacienteRow> GetTurnosAgendadosPorFecha(DateOnly fecha);

    /// Devuelve turnos vinculados a un bloque de programacion (via cupo), incluyendo nombre del paciente.
    IReadOnlyList<TurnoConPacienteRow> GetTurnosByBloqueId(Guid bloqueId);

    /// Insert batch de turnos (para seed inicial).
    void InsertTurnos(IEnumerable<TurnoPacienteRow> turnos);

    /// Insert de un turno individual.
    void InsertTurno(TurnoPacienteRow turno);

    /// Verifica si el paciente ya tiene un turno activo (AGENDADO/PROGRAMADO) para el mismo servicio en la misma fecha.
    bool ExisteTurnoActivoDuplicado(string pacienteId, string servicio, DateOnly fecha);

    /// Actualiza estado/motivo de un turno existente por ID.
    /// Devuelve cantidad de filas afectadas.
    int UpdateEstadoTurno(string turnoId, string estado, string? motivo);

    /// Inserta cupo si no existe para (bloqueId, horaInicio) y devuelve su ID, sin validar estado.
    Guid UpsertCupoAndGetId(Guid bloqueId, DateTimeOffset horaInicio, DateTimeOffset horaFin);

    /// Intenta reservar un cupo atómicamente. Si el cupo existe y está 'libre', lo marca 'reservado'.
    /// Si no existe, lo crea como 'reservado'. Devuelve el cupo ID o null si ya está tomado.
    Guid? TryReservarCupo(Guid bloqueId, DateTimeOffset horaInicio, DateTimeOffset horaFin);

    // ── sobreturno_disponibilidad ────────────────────────────────────────────

    /// Devuelve los disponibles para la clave. Si no existe, inserta con capacidadInicial y devuelve ese valor.
    int GetOrInitSobreturnosDisponibles(string stKey, int capacidadInicial);

    /// Decrementa en 1 (floor 0) y devuelve el valor resultante.
    int DecrementarSobreturno(string stKey);
}

/// Relacion paciente-financiador-plan vigente/historica.
public sealed record PacienteFinanciadorPlanRow(
    Guid Id,
    Guid PacienteId,
    Guid FinanciadorId,
    Guid PlanId,
    string Financiador,
    string Plan,
    string? NumeroAfiliado,
    bool Vigente
);

/// Fila de la tabla sch_turno.turno_paciente.
public sealed record TurnoPacienteRow(
    string Id,
    string PacienteId,
    string Profesional,
    string Servicio,
    string Centro,
    DateTimeOffset FechaHora,
    string Estado,
    string? Motivo,
    Guid CentroId = default,
    Guid ServicioId = default,
    Guid EfectorId = default,
    Guid CupoId = default
);

/// Fila de turno_paciente con nombre del paciente resuelto desde sch_persona.persona.
public sealed record TurnoConPacienteRow(
    Guid TurnoId,
    string PacienteNombre,
    DateTimeOffset FechaHora,
    string Estado
);
