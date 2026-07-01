namespace VitalFlow.His.Api.Application.Turnos.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    bool IsConfigured { get; }
}
