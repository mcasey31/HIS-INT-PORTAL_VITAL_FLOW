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

public sealed record DomicilioRequest(
    string? LocalidadId,
    string? Pais,
    string? Provincia,
    string? Localidad,
    string? Calle,
    string? Numero,
    string? Barrio,
    string? CodigoPostal,
    string? Piso,
    string? Departamento,
    string? Comentario
);

public sealed record DomicilioResponse(
    Guid Id,
    Guid PersonaId,
    string? LocalidadId,
    string Pais,
    string Provincia,
    string Localidad,
    string Calle,
    string Numero,
    string Barrio,
    string CodigoPostal,
    string Piso,
    string Departamento,
    string Comentario
);

public sealed record PersonaContactoRequest(
    string Nombre,
    string Apellido,
    string TipoDocumento,
    string NumeroDocumento,
    string FechaNacimiento,
    string SexoBiologico,
    string? Telefono,
    string? Email
);

public sealed record PersonaContactoResponse(
    Guid Id,
    Guid PersonaId,
    string Nombre,
    string Apellido,
    string TipoDocumento,
    string NumeroDocumento,
    string FechaNacimiento,
    string SexoBiologico,
    string Telefono,
    string Email
);
