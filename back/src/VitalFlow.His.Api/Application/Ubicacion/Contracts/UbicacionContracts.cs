namespace VitalFlow.His.Api.Application.Ubicacion.Contracts;

public sealed record ProvinciaResponse(string Id, string Nombre);

public sealed record LocalidadResponse(string Id, string ProvinciaId, string Nombre);
