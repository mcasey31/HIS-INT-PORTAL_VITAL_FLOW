namespace VitalFlow.His.Api.Application.EstructuraInterna.Contracts;

public sealed record CampoEstructuraInternaResponse(
    string Nombre,
    string Tipo,
    bool Obligatorio,
    string? Referencia
);

public sealed record NodoEstructuraInternaResponse(
    string Id,
    string Titulo,
    string Tabla,
    string Descripcion,
    IReadOnlyList<CampoEstructuraInternaResponse> Campos
);

public sealed record SaveRegistroNodoRequest(IReadOnlyDictionary<string, string?> Campos);

public sealed record RegistroNodoResponse(
    string NodoId,
    string Id,
    IReadOnlyDictionary<string, string?> Campos
);

public sealed record FinanciadorPlanCatalogoResponse(string Id, string Nombre);

public sealed record FinanciadorCatalogoResponse(
    string Id,
    string Nombre,
    IReadOnlyList<FinanciadorPlanCatalogoResponse> Planes
);
