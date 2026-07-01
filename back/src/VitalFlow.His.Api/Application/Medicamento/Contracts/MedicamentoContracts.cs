namespace VitalFlow.His.Api.Application.Medicamento.Contracts;

public sealed record MedicamentoResponse(
    int Id,
    string PrincipioActivo,
    string Presentacion,
    string Producto,
    string Laboratorio,
    string Familia,
    string Forma,
    bool EsGenerico
);

public sealed record BuscarMedicamentosRequest(
    string? Q,
    string? Generico,
    string? Laboratorio,
    bool SoloGenerico = false,
    int Page = 1,
    int PageSize = 20
);
