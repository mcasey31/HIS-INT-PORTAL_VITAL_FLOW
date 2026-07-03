using VitalFlow.His.Api.Application.Medicamento.Contracts;

namespace VitalFlow.His.Api.Application.Medicamento.Repositories;

public interface IMedicamentoRepository
{
    IReadOnlyList<MedicamentoResponse> Buscar(BuscarMedicamentosRequest request, out int totalCount);
}
