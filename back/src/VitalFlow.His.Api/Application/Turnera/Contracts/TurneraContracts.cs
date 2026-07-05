namespace VitalFlow.His.Api.Application.Turnera.Contracts;

public sealed record DisplayTurnoResponse(
    string Id,
    string Paciente,
    string Documento,
    string? Llegada,
    string Estado,
    string Servicio,
    string Efector
);

public sealed record DisplayTurneraResponse(
    IReadOnlyList<DisplayTurnoResponse> SalaEspera,
    IReadOnlyList<DisplayTurnoResponse> EnAtencion,
    DisplayTurnoResponse? UltimoLlamado
);

public sealed record LlamarPacienteTurneraRequest(
    string TurnoId
);

public sealed record LlamarPacienteTurneraResponse(
    bool Ok,
    string Paciente,
    string Estado
);

public sealed record UltimoLlamadoTurneraResponse(
    string? Paciente,
    string? Documento,
    string? Estado
);

public sealed record KioscoArriboRequest(
    string Documento,
    string CentroId
);

public sealed record KioscoArriboResponse(
    bool Ok,
    string? Mensaje,
    string? Paciente,
    string? TurnoId
);
