using VitalFlow.His.Api.Application.Personas.Contracts;

namespace VitalFlow.His.Api.Application.Personas.Services;

public interface IPersonaService
{
    IReadOnlyList<TipoDocumentoResponse> GetTiposDocumento();
    IReadOnlyList<PersonaCandidataResponse> BuscarPorTipoYNumeroDocumento(string tipoDocumento, string numeroDocumento);
    IReadOnlyList<PersonaCandidataResponse> BuscarPorSetDatosMinimos(BuscarPersonaSetMinimoRequest request);
    PersonaCandidataResponse EmpadronarConSetDatosMinimos(BuscarPersonaSetMinimoRequest request);
    PersonaCandidataResponse ActualizarSetDatosMinimos(Guid personaId, BuscarPersonaSetMinimoRequest request);
    BuscarPersonaSetMinimoRequest ParseAndValidateSetMinimoRequest(
        string tipoDocumento, string numeroDocumento, string nombre, string apellido,
        string fechaNacimiento, string sexoBiologico, string? email, string? telefono);
    DomicilioResponse? GetDomicilio(Guid personaId);
    DomicilioResponse UpsertDomicilio(Guid personaId, DomicilioRequest request);
    IReadOnlyList<PersonaContactoResponse> GetContactos(Guid personaId);
    PersonaContactoResponse CreateContacto(Guid personaId, PersonaContactoRequest request);
    PersonaContactoResponse UpdateContacto(Guid personaId, Guid contactoId, PersonaContactoRequest request);
    void DeleteContactos(Guid personaId, IReadOnlyList<Guid> contactoIds);
}
