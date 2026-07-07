using VitalFlow.His.Api.Application.Admision.Services;

namespace VitalFlow.His.Api.Infrastructure.BackgroundServices;

public sealed class ClearingDiarioBackgroundService(
    IServiceScopeFactory scopeFactory,
    IConfiguration configuration,
    ILogger<ClearingDiarioBackgroundService> logger)
    : BackgroundService
{
    private readonly string _centroId = configuration["ClearingDiario:CentroId"]
        ?? "00000000-0000-0000-0000-000000000001";
    private readonly int _horaEjecucion = configuration.GetValue<int>("ClearingDiario:HoraEjecucion", 3);
    private readonly int _intervaloHoras = configuration.GetValue<int>("ClearingDiario:IntervaloHoras", 24);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("ClearingDiarioBackgroundService iniciado. CentroId={CentroId}, Hora={Hora}:00 UTC, Intervalo={Intervalo}h",
            _centroId, _horaEjecucion, _intervaloHoras);

        var ahora = DateTimeOffset.UtcNow;
        var proximo = ahora.Date.AddHours(_horaEjecucion);

        if (proximo <= ahora)
            proximo = proximo.AddDays(1);

        var delay = proximo - ahora;
        logger.LogInformation("Proximo clearing diario en {Delay} (a las {Hora:HH:mm} UTC).",
            delay, proximo);

        await Task.Delay(delay, stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var service = scope.ServiceProvider.GetRequiredService<IAdmisionService>();
                var result = service.LimpiarEventosHuerfanos(
                    new Application.Admision.Contracts.LimpiarEventosHuerfanosRequest(
                        CentroId: _centroId, Modo: "AUTOMATICO"));

                logger.LogInformation(
                    "Clearing diario completado: {Total} turnos procesados " +
                    "({ProgAusente} programados->ausente, {SalaNoAtend} sala->no_atendido, " +
                    "{ObsAtend} observacion->atendido, {PagoNoAdm} pendiente_pago->no_admitido).",
                    result.TotalProcesados, result.ProgramadosAAusente,
                    result.SalaEsperaANoAtendido, result.ObservacionAAtendido,
                    result.PendientePagoANoAdmitido);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error ejecutando clearing diario.");
            }

            await Task.Delay(TimeSpan.FromHours(_intervaloHoras), stoppingToken);
        }
    }
}
