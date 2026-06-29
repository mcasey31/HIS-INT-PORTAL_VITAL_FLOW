namespace VitalFlow.His.Api.Application.Personas.Contracts;

public sealed record TipoDocumentoResponse(string Codigo, string Nombre);

public sealed record BuscarPersonaSetMinimoRequest(
    string TipoDocumento,
    string NumeroDocumento,
    string Nombre,
    string Apellido,
    DateOnly FechaNacimiento,
    string SexoBiologico,
    string? Email,
    string? Telefono
);

public sealed record PersonaCandidataResponse(
    Guid Id,
    string ApellidosNombres,
    string TipoDocumento,
    string NumeroDocumento,
    DateOnly FechaNacimiento,
    string SexoBiologico,
    string Estado,
    int PorcentajeCoincidencia,
    string? Email,
    string? Telefono
);
