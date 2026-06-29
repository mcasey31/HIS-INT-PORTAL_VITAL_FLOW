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

    public IReadOnlyList<PersonaCandidataResponse> BuscarPorApellidoNombre(string apellido, string nombre)
    {
        return repository.BuscarPorApellidoNombre(apellido, nombre);
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
}
