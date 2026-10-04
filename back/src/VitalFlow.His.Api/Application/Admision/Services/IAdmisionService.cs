using VitalFlow.His.Api.Application.Admision.Contracts;

namespace VitalFlow.His.Api.Application.Admision.Services;

public interface IAdmisionService
{
    SelectoresAdmisionResponse GetSelectores();
    IReadOnlyList<TurnoAdmisionResponse> BuscarTurnos(BuscarTurnosAdmisionRequest request);
    ConfirmarArriboTurnoResponse ConfirmarArribo(string turnoId, ConfirmarArriboTurnoRequest request);
    ActualizarEstadoTurnoResponse ActualizarEstadoTurno(string turnoId, ActualizarEstadoTurnoRequest request);
    EncuentroAdmisionResponse ObtenerEncuentro(string turnoId);
    CerrarEncuentroResponse CerrarEncuentro(string turnoId, CerrarEncuentroRequest request);
    CerrarEncuentrosVencidosResponse CerrarEncuentrosVencidos(int horasMaximas = 24);
    LimpiarEventosHuerfanosResponse LimpiarEventosHuerfanos(LimpiarEventosHuerfanosRequest? request = null);
}
