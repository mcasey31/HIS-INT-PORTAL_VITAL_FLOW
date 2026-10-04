namespace VitalFlow.His.Api.Application.Turnos.Contracts;

public sealed record TipoDocumentoTurnoResponse(string Codigo, string Nombre);

public sealed record FinanciadorPlanTurnoResponse(
    string Id,
    string? FinanciadorId,
    string? PlanId,
    string Financiador,
    string Plan,
    string? NumeroAfiliado,
    bool Vigente
);

public sealed record PacienteIdentificadoTurnoResponse(
    string Id,
    string ApellidosNombres,
    string TipoDocumento,
    string NumeroDocumento,
    DateOnly FechaNacimiento,
    string SexoBiologico,
    string? Email,
    string? Telefono,
    bool EsPaciente,
    IReadOnlyList<FinanciadorPlanTurnoResponse> Financiadores
);

public sealed record CentroTurnoResponse(string Id, string Nombre);

public sealed record ServicioTurnoResponse(string Id, string Nombre, IReadOnlyList<string> CentroIds);

public sealed record PracticaTurnoResponse(
    string Id,
    string Nombre,
    string ServicioId,
    IReadOnlyList<string> CentroIds,
    IReadOnlyList<string> ProfesionalIds
);

public sealed record ProfesionalTurnoResponse(
    string Id,
    string Nombre,
    IReadOnlyList<string> CentroIds,
    IReadOnlyList<string> ServicioIds,
    IReadOnlyList<string> PracticaIds
);

public sealed record SelectoresDisponibilidadTurnoResponse(
    IReadOnlyList<CentroTurnoResponse> Centros,
    IReadOnlyList<ServicioTurnoResponse> Servicios,
    IReadOnlyList<PracticaTurnoResponse> Practicas,
    IReadOnlyList<ProfesionalTurnoResponse> Profesionales
);

public sealed record BuscarDisponibilidadTurnoRequest(
    string PacienteId,
    string FinanciadorPlanId,
    IReadOnlyList<string> CentroIds,
    string ServicioId,
    string PracticaId,
    string? ProfesionalId
);

public sealed record DisponibilidadSlotTurnoResponse(
    string Id,
    DateOnly Fecha,
    string Hora,
    string TipoSlot,
    string RangoHoraInicio,
    string RangoHoraFin,
    string Centro,
    string Servicio,
    string Practica,
    string Profesional,
    string Estado,
    int? SobreTurnosDisponibles,
    string? Mensaje
);

public sealed record AsignarTurnoRequest(
    string PacienteId,
    string SlotId,
    string FinanciadorPlanId,
    string? Email,
    string? Telefono,
    bool GuardarContactoEnPerfil,
    string? Centro,
    string? Servicio,
    string? Practica,
    string? Profesional,
    DateOnly? Fecha,
    string? Hora
);

public sealed record NotificacionTurnoEmailResponse(
    string Destinatario,
    string Asunto,
    string MensajeResumen,
    string Centro
);

public sealed record AsignarTurnoResponse(
    bool Ok,
    string TurnoId,
    string? Warning,
    string Message,
    NotificacionTurnoEmailResponse? NotificacionEmail
);

public sealed record AsignarSobreturnoRequest(
    string PacienteId,
    string SlotId,
    string FinanciadorPlanId,
    DateOnly Fecha,
    string Hora
);

public sealed record AsignarSobreturnoResponse(bool Ok, string TurnoId, string SlotId, string Message);

public sealed record TurnoPacienteResponse(
    string Id,
    string Profesional,
    string Servicio,
    string Centro,
    DateTimeOffset FechaHora,
    string Estado,
    string? Motivo
);

public sealed record TurnosPacientePageResponse(
    IReadOnlyList<TurnoPacienteResponse> Items,
    int Total,
    int Page,
    int PageSize
);

public sealed record GuardarPacienteFinanciadorTurnoRequest(
    string FinanciadorId,
    string PlanId,
    string? NumeroAfiliado,
    string? ReemplazarFinanciadorPlanId
);
