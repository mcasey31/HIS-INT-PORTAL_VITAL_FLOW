using VitalFlow.His.Api.Application.Personas.Contracts;

namespace VitalFlow.His.Api.Application.Personas.Repositories;

public interface IPersonaRepository
{
    IReadOnlyList<TipoDocumentoResponse> GetTiposDocumento();
    IReadOnlyList<PersonaCandidataResponse> BuscarPorTipoYNumeroDocumento(string tipoDocumento, string numeroDocumento);
    IReadOnlyList<PersonaCandidataResponse> BuscarPorSetDatosMinimos(BuscarPersonaSetMinimoRequest request);
    PersonaCandidataResponse EmpadronarConSetDatosMinimos(BuscarPersonaSetMinimoRequest request);
    PersonaCandidataResponse ActualizarSetDatosMinimos(Guid personaId, BuscarPersonaSetMinimoRequest request);
    DomicilioResponse? GetDomicilio(Guid personaId);
    DomicilioResponse UpsertDomicilio(Guid personaId, DomicilioRequest request);
    IReadOnlyList<PersonaContactoResponse> GetContactos(Guid personaId);
    PersonaContactoResponse CreateContacto(Guid personaId, PersonaContactoRequest request);
    PersonaContactoResponse UpdateContacto(Guid contactoId, PersonaContactoRequest request);
    void DeleteContactos(Guid personaId, IReadOnlyList<Guid> contactoIds);
}
