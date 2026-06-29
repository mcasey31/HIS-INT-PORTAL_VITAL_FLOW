namespace VitalFlow.His.Api.Domain.Agenda;

public sealed class AgendaAggregate
{
    public Guid Id { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public Guid CentroId { get; set; }
    public string CentroNombre { get; set; } = string.Empty;
    public Guid ServicioId { get; set; }
    public string ServicioNombre { get; set; } = string.Empty;
    public string TipoEfector { get; set; } = string.Empty;
    public Guid EfectorId { get; set; }
    public string EfectorNombre { get; set; } = string.Empty;
    public string TipoAgenda { get; set; } = string.Empty;
    public bool VisibleContactCenter { get; set; } = true;
    public bool Activa { get; set; } = true;
    public DateOnly FechaDesde { get; set; }
    public DateOnly? FechaHasta { get; set; }
    public string? Observacion { get; set; }
    public List<BloqueProgramacion> Bloques { get; } = new();
    public List<BloqueoAgenda> Bloqueos { get; } = new();
}

public sealed class BloqueProgramacion
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string TipoBloque { get; set; } = "FIJA";
    public DateOnly FechaDesde { get; set; }
    public DateOnly FechaHasta { get; set; }
    public bool AtiendeFeriados { get; set; }
    public List<string> Dias { get; } = new();
    public DateOnly Fecha { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFin { get; set; }
    public int DuracionTurnoMinutos { get; set; }
    public int IntervaloMinutos { get; set; }
    public Guid LugarAtencionId { get; set; }
    public string LugarAtencionNombre { get; set; } = string.Empty;
    public string Frecuencia { get; set; } = "SEMANAL";
    public List<int> OrdenMensualSemanas { get; } = new();
    public List<BloquePractica> Practicas { get; } = new();
    public int Sobreturnos { get; set; }
    public bool Activo { get; set; } = true;
}

public sealed class BloquePractica
{
    public string Nombre { get; set; } = string.Empty;
    public int DuracionMinutos { get; set; }
}

public sealed class BloqueoAgenda
{
    public Guid Id { get; set; }
    public DateTimeOffset Inicio { get; set; }
    public DateTimeOffset Fin { get; set; }
    public string Tipo { get; set; } = "busy-unavailable";
}

public sealed record AgendaSlot(
    Guid Id,
    Guid ScheduleId,
    DateTimeOffset Start,
    DateTimeOffset End,
    string Estado,
    int Capacidad,
    bool OverbookingPermitido,
    Guid? LugarAtencionId,
    string? LugarAtencionNombre,
    string? ScheduleNombre
);

public sealed record AgendaSlotSearchResult(
    int Total,
    IReadOnlyList<AgendaSlot> Slots
);

public sealed record AgendaLocation(
    Guid Id,
    string Nombre,
    bool Activo
);

public sealed record AgendaLocationSearchResult(
    int Total,
    IReadOnlyList<AgendaLocation> Locations
);

public enum FhirAppointmentCreateStatus
{
    Created,
    IdempotentReplay,
    SlotNotFound,
    SlotUnavailable,
    ValidationError
}

public sealed record FhirAppointmentCreateInput(
    string PatientId,
    Guid SlotId,
    DateTimeOffset? RequestedStart,
    DateTimeOffset? RequestedEnd,
    string? Reason,
    string? ExternalIdentifier,
    string IdempotencyKey,
    string CorrelationId
);

public sealed record FhirAppointmentRecord(
    string AppointmentId,
    string PatientId,
    Guid SlotId,
    Guid ScheduleId,
    Guid CentroId,
    Guid ServicioId,
    Guid EfectorId,
    DateTimeOffset Start,
    DateTimeOffset End,
    string Status,
    string? Reason,
    string? ExternalIdentifier
);

public sealed record FhirAppointmentCreateResult(
    FhirAppointmentCreateStatus Status,
    FhirAppointmentRecord? Appointment,
    string? Diagnostics
);

public sealed record FhirAppointmentSearchResult(
    int Total,
    IReadOnlyList<FhirAppointmentRecord> Appointments
);

public sealed record CentroAgenda(Guid Id, string Nombre);
public sealed record ServicioAgenda(Guid Id, Guid CentroId, string Nombre);
public sealed record EfectorAgenda(Guid Id, Guid CentroId, Guid ServicioId, string TipoEfector, string Nombre);
public sealed record LugarAtencionAgenda(Guid Id, string Nombre);
public sealed record PracticaAgenda(string Nombre, int? DuracionMinutosSugerida);

public sealed class GrupoProfesionalAggregate
{
    public Guid Id { get; set; }
    public Guid CentroId { get; set; }
    public string CentroNombre { get; set; } = string.Empty;
    public Guid ServicioId { get; set; }
    public string ServicioNombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; } = true;
    public List<GrupoProfesionalMiembro> Miembros { get; } = new();
}

public sealed class GrupoProfesionalMiembro
{
    public Guid Id { get; set; }
    public Guid EfectorId { get; set; }
    public string EfectorNombre { get; set; } = string.Empty;
    public string? Rol { get; set; }
    public int? Orden { get; set; }
    public bool Activo { get; set; } = true;
}
