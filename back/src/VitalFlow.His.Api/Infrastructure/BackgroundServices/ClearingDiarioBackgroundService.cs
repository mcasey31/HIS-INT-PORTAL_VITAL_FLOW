using VitalFlow.His.Api.Application.Admision.Services;

namespace VitalFlow.His.Api.Infrastructure.BackgroundServices;

public sealed class ClearingDiarioBackgroundService(
    IServiceScopeFactory scopeFactory,
    ILogger<ClearingDiarioBackgroundService> logger)
    : BackgroundService
{
    private const string CentroDefault = "00000000-0000-0000-0000-000000000001";

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("ClearingDiarioBackgroundService iniciado.");

        var ahora = DateTimeOffset.UtcNow;
        var proximo = ahora.Date.AddDays(1).AddHours(3);

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
                        CentroId: CentroDefault, Modo: "AUTOMATICO"));

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

            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}
