using VitalFlow.His.Api.Application.Personas.Contracts;

namespace VitalFlow.His.Api.Application.Personas.Repositories;

public interface IPersonaRepository
{
    IReadOnlyList<TipoDocumentoResponse> GetTiposDocumento();
    IReadOnlyList<PersonaCandidataResponse> BuscarPorTipoYNumeroDocumento(string tipoDocumento, string numeroDocumento);
    IReadOnlyList<PersonaCandidataResponse> BuscarPorApellidoNombre(string apellido, string nombre);
    IReadOnlyList<PersonaCandidataResponse> BuscarPorSetDatosMinimos(BuscarPersonaSetMinimoRequest request);
    PersonaCandidataResponse EmpadronarConSetDatosMinimos(BuscarPersonaSetMinimoRequest request);
    PersonaCandidataResponse ActualizarSetDatosMinimos(Guid personaId, BuscarPersonaSetMinimoRequest request);
}
