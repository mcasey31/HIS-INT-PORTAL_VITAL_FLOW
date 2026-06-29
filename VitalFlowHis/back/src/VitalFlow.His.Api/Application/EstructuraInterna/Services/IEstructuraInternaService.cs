using VitalFlow.His.Api.Application.EstructuraInterna.Contracts;

namespace VitalFlow.His.Api.Application.EstructuraInterna.Services;

public interface IEstructuraInternaService
{
    IReadOnlyList<NodoEstructuraInternaResponse> GetNodos();
    IReadOnlyList<RegistroNodoResponse> GetRegistros(string nodoId);
    RegistroNodoResponse SaveRegistro(string nodoId, SaveRegistroNodoRequest request);
}
