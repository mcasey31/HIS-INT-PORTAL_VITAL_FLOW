using VitalFlow.His.Api.Application.Medicamento.Contracts;

namespace VitalFlow.His.Api.Application.Medicamento.Services;

public interface IMedicamentoService
{
    (IReadOnlyList<MedicamentoResponse> Items, int TotalCount) Buscar(BuscarMedicamentosRequest request);
}
