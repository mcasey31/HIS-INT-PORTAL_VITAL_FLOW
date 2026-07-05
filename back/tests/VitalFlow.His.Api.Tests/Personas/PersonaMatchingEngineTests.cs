using VitalFlow.His.Api.Application.Personas.Contracts;
using VitalFlow.His.Api.Application.Personas.Domain;
using Xunit;

namespace VitalFlow.His.Api.Tests.Personas;

public sealed class PersonaMatchingEngineTests
{
    [Fact]
    public void CoincideNumeroDocumento_DniConPrefijoMf_DeberiaCoincidir()
    {
        var result = PersonaMatchingEngine.CoincideNumeroDocumento("DNI", "12345678", "DNI", "F12345678");

        Assert.True(result);
    }

    [Fact]
    public void CalcularPorcentajeCoincidencia_MatchExacto_DeberiaSer100()
    {
        var request = new BuscarPersonaSetMinimoRequest(null, "DNI", "12345678", "Juan", "Perez", new DateOnly(1991, 2, 20), "M");
        var candidato = new PersonaCandidataResponse(
            Guid.NewGuid(),
            "Perez, Juan",
            "DNI",
            "12345678",
            new DateOnly(1991, 2, 20),
            "M",
            "ACTIVO",
            0,
            null,
            null
        );

        var score = PersonaMatchingEngine.CalcularPorcentajeCoincidencia(request, candidato);

        Assert.Equal(100, score);
    }

    [Fact]
    public void CalcularPorcentajeCoincidencia_MatchParcial_DeberiaSer60()
    {
        var request = new BuscarPersonaSetMinimoRequest(null, "DNI", "12345678", "Juan", "Perez", new DateOnly(1991, 2, 20), "M");
        var candidato = new PersonaCandidataResponse(
            Guid.NewGuid(),
            "Perez, Juana",
            "DNI",
            "F12345678",
            new DateOnly(1992, 5, 11),
            "F",
            "ACTIVO",
            0,
            null,
            null
        );

        var score = PersonaMatchingEngine.CalcularPorcentajeCoincidencia(request, candidato);

        Assert.Equal(60, score);
    }
}
