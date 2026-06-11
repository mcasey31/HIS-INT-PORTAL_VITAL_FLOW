using VitalFlow.His.Api.Application.Personas.Contracts;

namespace VitalFlow.His.Api.Application.Personas.Services;

public interface IPersonaService
{
    IReadOnlyList<TipoDocumentoResponse> GetTiposDocumento();
    IReadOnlyList<PersonaCandidataResponse> BuscarPorTipoYNumeroDocumento(string tipoDocumento, string numeroDocumento);
    IReadOnlyList<PersonaCandidataResponse> BuscarPorSetDatosMinimos(BuscarPersonaSetMinimoRequest request);
    PersonaCandidataResponse EmpadronarConSetDatosMinimos(BuscarPersonaSetMinimoRequest request);
    PersonaCandidataResponse ActualizarSetDatosMinimos(Guid personaId, BuscarPersonaSetMinimoRequest request);
}
