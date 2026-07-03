namespace VitalFlow.His.Api.Application.Admision.Contracts;

public sealed record AdmisionScopeContext(
    bool EsAdministrador,
    bool EsMedico,
    Guid? CentroId,
    Guid? PersonaId,
    Guid? UserId
);

public sealed record SelectorAdmisionResponse(string Id, string Nombre);

public sealed record PracticaAdmisionResponse(
    string Id,
    string Nombre,
    string ServicioId
);

public sealed record EfectorAdmisionResponse(
    string Id,
    string Nombre,
    string TipoEfector,
    string ServicioId
);

public sealed record SelectoresAdmisionResponse(
    IReadOnlyList<SelectorAdmisionResponse> Servicios,
    IReadOnlyList<PracticaAdmisionResponse> Practicas,
    IReadOnlyList<string> TiposEfector,
    IReadOnlyList<EfectorAdmisionResponse> Efectores,
    IReadOnlyList<string> Estados
);

public sealed record BuscarTurnosAdmisionRequest(
    string? ServicioId,
    string? PracticaId,
    string? TipoEfector,
    string? EfectorId,
    DateOnly? Fecha,
    string? Estado
);

public sealed record TurnoAdmisionResponse(
    string Id,
    string Turno,
    string? Llegada,
    string Paciente,
    string Documento,
    string Financiador,
    string Servicio,
    string Efector,
    string Estado,
    string EstadoTurno,
    string? PacienteId = null,
    string? LugarAtencion = null
);

public sealed record ConfirmarArriboTurnoResponse(
    string TurnoId,
    string Estado,
    string Llegada,
    string EstadoTurno,
    string? EncuentroId,
    string? FacturacionEventoEstado,
    string? FacturacionEventoDetalle
);

public sealed record ConfirmarArriboTurnoRequest(
    string PacienteId,
    string Paciente,
    string Documento,
    string Financiador,
    bool? DocumentacionValidada,
    bool? RequierePago,
    bool? PagoRegistrado,
    bool? PracticaCienPorcientoConvenida,
    /// Si no se envian, el servicio intentara resolver cobertura vigente del paciente.
    /// Si no puede resolver financiador + plan, rechaza el arribo para no publicar eventos incompletos.
    string? FinanciadorId,
    string? PlanId,
    string? ServicioNombre,
    string? CentroId,
    /// Práctica asistencial del turno — obligatoria clínicamente, opcional en el contrato HTTP
    /// para mantener retrocompatibilidad con llamadas que no la envíen aún.
    string? PracticaOrigenNombre = null,
    string? PracticaOrigenCodigo = null,
    string? ProfesionalId = null,
    string? ProfesionalNombre = null,
    string? TipoOrigen = null
);

public sealed record ActualizarEstadoTurnoRequest(
    string Estado,
    string? Motivo
);

public sealed record ActualizarEstadoTurnoResponse(
    string TurnoId,
    string Estado,
    string? Motivo
);

public sealed record EncuentroAdmisionResponse(
    string EncuentroId,
    string TurnoId,
    string PacienteId,
    string Estado,
    string CreadoEn,
    string? CerradoEn,
    string? MotivoCierre
);

public sealed record CerrarEncuentroRequest(
    string EstadoPacienteFinal,
    string? Motivo
);

public sealed record CerrarEncuentroResponse(
    string EncuentroId,
    string TurnoId,
    string EstadoEncuentro,
    string EstadoPacienteFinal,
    string CerradoEn,
    string? Motivo
);

public sealed record CerrarEncuentrosVencidosResponse(
    int Cerrados,
    int HorasMaximas
);

public sealed record EventoFacturacionTurnoResponse(
    string TurnoId,
    string Estado,
    string? ErrorDetalle,
    string? CreatedAt,
    string? ProcessedAt
);
