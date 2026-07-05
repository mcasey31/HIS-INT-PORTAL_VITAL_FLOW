using VitalFlow.His.Api.Application.Turnera.Contracts;

namespace VitalFlow.His.Api.Application.Turnera.Services;

public interface ITurneraService
{
    DisplayTurneraResponse GetDisplay(string? centroId, string? efectorId);
    LlamarPacienteTurneraResponse LlamarPaciente(string turnoId);
    UltimoLlamadoTurneraResponse GetUltimoLlamado(string? centroId, string? efectorId);
    KioscoArriboResponse KioscoArribo(KioscoArriboRequest request);
}
