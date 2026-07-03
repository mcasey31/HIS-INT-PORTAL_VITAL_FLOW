namespace VitalFlow.His.Api.Application.Agenda.Contracts;

public sealed record AgendaSummaryResponse(
    Guid Id,
    string Codigo,
    string Nombre,
    Guid CentroId,
    string Centro,
    Guid ServicioId,
    string Servicio,
    string TipoEfector,
    Guid EfectorId,
    string Efector,
    string TipoAgenda,
    bool VisibleContactCenter,
    bool Activa,
    DateOnly FechaDesde,
    DateOnly? FechaHasta,
    string? Observacion,
    int Bloques,
    int Bloqueos
);

public sealed record AgendaDetailResponse(
    Guid Id,
    string Codigo,
    string Nombre,
    Guid CentroId,
    string Centro,
    Guid ServicioId,
    string Servicio,
    string TipoEfector,
    Guid EfectorId,
    string Efector,
    string TipoAgenda,
    bool VisibleContactCenter,
    bool Activa,
    DateOnly FechaDesde,
    DateOnly? FechaHasta,
    string? Observacion,
    IReadOnlyList<BloqueResponse> Bloques,
    IReadOnlyList<BloqueoResponse> Bloqueos
);

public sealed record BloqueResponse(
    Guid Id,
    string Nombre,
    string TipoBloque,
    DateOnly FechaDesde,
    DateOnly FechaHasta,
    bool AtiendeFeriados,
    IReadOnlyList<string> Dias,
    DateOnly Fecha,
    TimeOnly HoraInicio,
    TimeOnly HoraFin,
    int DuracionTurnoMinutos,
    int IntervaloMinutos,
    Guid LugarAtencionId,
    string LugarAtencion,
    string Frecuencia,
    IReadOnlyList<int> OrdenMensualSemanas,
    IReadOnlyList<BloquePracticaResponse> Practicas,
    int Sobreturnos,
    bool Activo
);

public sealed record BloquePracticaResponse(
    string Nombre,
    int DuracionMinutos
);

public sealed record BloqueoResponse(
    Guid Id,
    DateTimeOffset Inicio,
    DateTimeOffset Fin,
    string Tipo
);

public sealed record CreateAgendaRequest(
    string Nombre,
    Guid CentroId,
    Guid ServicioId,
    string TipoEfector,
    Guid EfectorId,
    string TipoAgenda,
    bool VisibleContactCenter,
    DateOnly FechaDesde,
    DateOnly? FechaHasta,
    string? Observacion
);

public sealed record UpdateAgendaRequest(
    string Codigo,
    string Nombre,
    Guid CentroId,
    Guid ServicioId,
    string TipoEfector,
    Guid EfectorId,
    string TipoAgenda,
    bool VisibleContactCenter,
    DateOnly FechaDesde,
    DateOnly? FechaHasta,
    string? Observacion
);

public sealed record SelectorOptionResponse(Guid Id, string Nombre);

public sealed record EfectorOptionResponse(Guid Id, string Nombre, string TipoEfector);

public sealed record DiaSemanaOptionResponse(string Codigo, string Nombre);

public sealed record PracticaOptionResponse(Guid Id, string Nombre, int? DuracionMinutosSugerida, string? CodigoClinico);

public sealed record CopyAgendaRequest(
    string Codigo,
    string Nombre,
    DateOnly FechaDesde,
    DateOnly? FechaHasta
);

public sealed record SetAgendaStateRequest(
    bool Activa
);

public sealed record CreateBloqueRequest(
    string Nombre,
    string TipoBloque,
    DateOnly FechaDesde,
    DateOnly FechaHasta,
    bool AtiendeFeriados,
    IReadOnlyList<string> Dias,
    string HoraInicio,
    string HoraFin,
    int DuracionTurnoMinutos,
    Guid LugarAtencionId,
    string Frecuencia,
    IReadOnlyList<int>? OrdenMensualSemanas,
    IReadOnlyList<BloquePracticaRequest>? Practicas,
    int Sobreturnos
);

public sealed record BloquePracticaRequest(
    string Nombre,
    int? DuracionMinutos
);

public sealed record UpdateBloqueRequest(
    DateOnly Fecha,
    string HoraInicio,
    string HoraFin,
    int IntervaloMinutos
);

public sealed record CreateBloqueoRequest(
    DateTimeOffset Inicio,
    DateTimeOffset Fin,
    string Tipo
);

public sealed record DisponibilidadResponse(
    Guid AgendaId,
    int CuposTotales,
    int CuposDisponibles,
    int BloqueosActivos
);

public sealed record FhirSlotSearchResultResponse(
    int Total,
    IReadOnlyList<FhirSlotResponse> Slots
);

public sealed record FhirSlotResponse(
    Guid Id,
    Guid ScheduleId,
    DateTimeOffset Start,
    DateTimeOffset End,
    string Status,
    int Capacity,
    bool Overbooked,
    Guid? LocationId,
    string? LocationName,
    string? ScheduleName
);

public sealed record FhirAppointmentCreateRequest(
    string PatientId,
    Guid SlotId,
    DateTimeOffset? Start,
    DateTimeOffset? End,
    string? Reason,
    string? ExternalIdentifier,
    string IdempotencyKey,
    string CorrelationId
);

public sealed record FhirAppointmentCreateResultResponse(
    string Outcome,
    FhirAppointmentResponse? Appointment,
    string? Diagnostics
);

public sealed record FhirAppointmentResponse(
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

public sealed record FhirAppointmentSearchResultResponse(
    int Total,
    IReadOnlyList<FhirAppointmentResponse> Appointments
);

public sealed record FhirLocationSearchResultResponse(
    int Total,
    IReadOnlyList<FhirLocationResponse> Locations
);

public sealed record FhirLocationResponse(
    Guid Id,
    string Name,
    bool Active
);

public sealed record TurnoACancelarResponse(
    Guid TurnoId,
    string Paciente,
    DateTimeOffset FechaHora,
    string Estado
);

public sealed record CreateGrupoProfesionalRequest(
    string Codigo,
    string Nombre,
    Guid CentroId,
    Guid ServicioId,
    string? Descripcion,
    IReadOnlyList<CreateGrupoProfesionalMiembroRequest> Miembros
);

public sealed record CreateGrupoProfesionalMiembroRequest(
    Guid EfectorId,
    string? Rol,
    int? Orden
);

public sealed record GrupoProfesionalResponse(
    Guid Id,
    string Codigo,
    string Nombre,
    Guid CentroId,
    string Centro,
    Guid ServicioId,
    string Servicio,
    string? Descripcion,
    bool Activo,
    IReadOnlyList<GrupoProfesionalMiembroResponse> Miembros
);

public sealed record GrupoProfesionalMiembroResponse(
    Guid Id,
    Guid EfectorId,
    string Efector,
    string? Rol,
    int? Orden,
    bool Activo
);
