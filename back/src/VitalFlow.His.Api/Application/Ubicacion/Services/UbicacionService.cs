using VitalFlow.His.Api.Application.Ubicacion.Contracts;
using VitalFlow.His.Api.Application.Ubicacion.Repositories;

namespace VitalFlow.His.Api.Application.Ubicacion.Services;

public sealed class UbicacionService(IUbicacionRepository repository) : IUbicacionService
{
    public IReadOnlyList<ProvinciaResponse> GetProvincias()
    {
        return repository.GetProvincias();
    }

    public IReadOnlyList<LocalidadResponse> GetLocalidades(string? provinciaId)
    {
        return repository.GetLocalidades(provinciaId);
    }
}
