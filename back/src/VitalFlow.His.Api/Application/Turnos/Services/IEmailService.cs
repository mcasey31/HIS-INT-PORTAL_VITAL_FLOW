namespace VitalFlow.His.Api.Application.Turnos.Services;

public sealed record EmailAttachment(string FileName, string ContentBase64, string MediaType);

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, IReadOnlyList<EmailAttachment>? attachments = null);
    bool IsConfigured { get; }
}
