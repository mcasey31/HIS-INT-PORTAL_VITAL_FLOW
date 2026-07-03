using VitalFlow.His.Api.Application.Ubicacion.Contracts;

namespace VitalFlow.His.Api.Application.Ubicacion.Services;

public interface IUbicacionService
{
    IReadOnlyList<ProvinciaResponse> GetProvincias();
    IReadOnlyList<LocalidadResponse> GetLocalidades(string? provinciaId);
}
