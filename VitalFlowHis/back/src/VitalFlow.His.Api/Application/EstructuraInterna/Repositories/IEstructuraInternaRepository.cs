namespace VitalFlow.His.Api.Application.EstructuraInterna.Repositories;

public interface IEstructuraInternaRepository
{
    IReadOnlyList<IReadOnlyDictionary<string, string?>> GetRegistros(string nodoId);
    IReadOnlyDictionary<string, string?> SaveRegistro(string nodoId, IReadOnlyDictionary<string, string?> campos);
}
