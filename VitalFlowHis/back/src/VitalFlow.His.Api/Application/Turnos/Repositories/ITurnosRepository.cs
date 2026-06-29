namespace VitalFlow.His.Api.Application.Turnos.Repositories;

public interface ITurnosRepository
{
    // ── paciente_financiador_plan ───────────────────────────────────────────

    /// Devuelve pares centro-servicio activos para construir selectores sin depender de agendas.
    IReadOnlyList<CentroServicioActivoRow> GetCentrosConServiciosActivos();

    /// Devuelve catalogo activo de financiadores y planes.
    IReadOnlyList<FinanciadorPlanCatalogoRow> GetFinanciadoresCatalogo();

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

    /// Insert batch de turnos (para seed inicial).
    void InsertTurnos(IEnumerable<TurnoPacienteRow> turnos);

    /// Insert de un turno individual.
    void InsertTurno(TurnoPacienteRow turno);

    /// Actualiza estado/motivo de un turno existente por ID.
    /// Devuelve cantidad de filas afectadas.
    int UpdateEstadoTurno(string turnoId, string estado, string? motivo);

    /// Inserta cupo si no existe para (bloqueId, horaInicio) y devuelve su ID.
    Guid UpsertCupoAndGetId(Guid bloqueId, DateTimeOffset horaInicio, DateTimeOffset horaFin);

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

public sealed record FinanciadorPlanCatalogoRow(
    Guid FinanciadorId,
    string FinanciadorCodigo,
    string FinanciadorNombre,
    Guid PlanId,
    string PlanCodigo,
    string PlanNombre
);

public sealed record CentroServicioActivoRow(
    Guid CentroId,
    string CentroNombre,
    Guid ServicioId,
    string ServicioNombre
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
