using VitalFlow.His.Api.Application.Personas.Contracts;
using VitalFlow.His.Api.Application.Personas.Domain;
using VitalFlow.His.Api.Application.Personas.Repositories;

namespace VitalFlow.His.Api.Application.Personas.Services;

public sealed class PersonaService(IPersonaRepository repository) : IPersonaService
{
    private const int UmbralCoincidenciaAlta = 90;

    public IReadOnlyList<TipoDocumentoResponse> GetTiposDocumento() => repository.GetTiposDocumento();

    public IReadOnlyList<PersonaCandidataResponse> BuscarPorTipoYNumeroDocumento(string tipoDocumento, string numeroDocumento)
    {
        return repository.BuscarPorTipoYNumeroDocumento(tipoDocumento, numeroDocumento);
    }

    public IReadOnlyList<PersonaCandidataResponse> BuscarPorSetDatosMinimos(BuscarPersonaSetMinimoRequest request)
    {
        return repository.BuscarPorSetDatosMinimos(request);
    }

    public PersonaCandidataResponse EmpadronarConSetDatosMinimos(BuscarPersonaSetMinimoRequest request)
    {
        var duplicadosDocumento = repository.BuscarPorTipoYNumeroDocumento(request.TipoDocumento, request.NumeroDocumento);
        if (duplicadosDocumento.Count > 0)
        {
            throw new InvalidOperationException("Ya existe una persona activa con ese tipo y numero de documento.");
        }

        var posiblesDuplicados = repository.BuscarPorSetDatosMinimos(request);
        var duplicadoFuerte = posiblesDuplicados.FirstOrDefault(candidate =>
            candidate.PorcentajeCoincidencia >= UmbralCoincidenciaAlta
            || (
                PersonaMatchingEngine.CoincideNumeroDocumento(
                    request.TipoDocumento,
                    request.NumeroDocumento,
                    candidate.TipoDocumento,
                    candidate.NumeroDocumento)
                && candidate.FechaNacimiento == request.FechaNacimiento
            ));

        if (duplicadoFuerte is not null)
        {
            throw new InvalidOperationException(
                $"Posible duplicado detectado (coincidencia {duplicadoFuerte.PorcentajeCoincidencia}%). Revise persona existente: {duplicadoFuerte.ApellidosNombres}.");
        }

        return repository.EmpadronarConSetDatosMinimos(request);
    }

    public PersonaCandidataResponse ActualizarSetDatosMinimos(Guid personaId, BuscarPersonaSetMinimoRequest request)
    {
        var duplicadosDocumento = repository.BuscarPorTipoYNumeroDocumento(request.TipoDocumento, request.NumeroDocumento);
        var existeOtroConMismoDocumento = duplicadosDocumento.Any(candidate => candidate.Id != personaId);
        if (existeOtroConMismoDocumento)
        {
            throw new ArgumentException("Ya existe otra persona activa con ese tipo y numero de documento.");
        }

        return repository.ActualizarSetDatosMinimos(personaId, request);
    }

    public BuscarPersonaSetMinimoRequest ParseAndValidateSetMinimoRequest(
        string tipoDocumento, string numeroDocumento, string nombre, string apellido,
        string fechaNacimiento, string sexoBiologico, string? email, string? telefono)
    {
        if (string.IsNullOrWhiteSpace(tipoDocumento) ||
            string.IsNullOrWhiteSpace(numeroDocumento) ||
            string.IsNullOrWhiteSpace(nombre) ||
            string.IsNullOrWhiteSpace(apellido) ||
            string.IsNullOrWhiteSpace(fechaNacimiento) ||
            string.IsNullOrWhiteSpace(sexoBiologico))
        {
            throw new ArgumentException("Todos los campos del set de datos minimos son obligatorios.");
        }

        if (!DateOnly.TryParse(fechaNacimiento, out var fechaNacimientoValue))
        {
            throw new ArgumentException("fechaNacimiento tiene formato invalido.");
        }

        if (fechaNacimientoValue > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            throw new ArgumentException("fechaNacimiento no puede ser posterior a la fecha actual.");
        }

        return new BuscarPersonaSetMinimoRequest(
            tipoDocumento,
            numeroDocumento,
            nombre,
            apellido,
            fechaNacimientoValue,
            sexoBiologico,
            string.IsNullOrWhiteSpace(email) ? null : email.Trim(),
            string.IsNullOrWhiteSpace(telefono) ? null : telefono.Trim()
        );
    }

    public DomicilioResponse? GetDomicilio(Guid personaId) => repository.GetDomicilio(personaId);

    public DomicilioResponse UpsertDomicilio(Guid personaId, DomicilioRequest request) =>
        repository.UpsertDomicilio(personaId, request);

    public IReadOnlyList<PersonaContactoResponse> GetContactos(Guid personaId) =>
        repository.GetContactos(personaId);

    public PersonaContactoResponse CreateContacto(Guid personaId, PersonaContactoRequest request) =>
        repository.CreateContacto(personaId, request);

    public PersonaContactoResponse UpdateContacto(Guid personaId, Guid contactoId, PersonaContactoRequest request) =>
        repository.UpdateContacto(contactoId, request);

    public void DeleteContactos(Guid personaId, IReadOnlyList<Guid> contactoIds) =>
        repository.DeleteContactos(personaId, contactoIds);
}
