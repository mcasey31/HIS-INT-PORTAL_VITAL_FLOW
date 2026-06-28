using VitalFlow.His.Api.Application.Medicamento.Contracts;
using VitalFlow.His.Api.Application.Medicamento.Repositories;

namespace VitalFlow.His.Api.Application.Medicamento.Services;

public sealed class MedicamentoService(IMedicamentoRepository medicamentoRepository) : IMedicamentoService
{
    public (IReadOnlyList<MedicamentoResponse> Items, int TotalCount) Buscar(BuscarMedicamentosRequest request)
    {
        if (request.Page < 1) request = request with { Page = 1 };
        if (request.PageSize < 1) request = request with { PageSize = 20 };
        if (request.PageSize > 100) request = request with { PageSize = 100 };

        var items = medicamentoRepository.Buscar(request, out var totalCount);
        return (items, totalCount);
    }
}
