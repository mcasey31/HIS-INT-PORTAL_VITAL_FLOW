using VitalFlow.His.Api.Application.Ubicacion.Contracts;

namespace VitalFlow.His.Api.Application.Ubicacion.Repositories;

public interface IUbicacionRepository
{
    IReadOnlyList<ProvinciaResponse> GetProvincias();
    IReadOnlyList<LocalidadResponse> GetLocalidades(string? provinciaId);
}
