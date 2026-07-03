using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace VitalFlow.His.Api.Application.Turnos.Services;

public sealed class SmtpEmailService : IEmailService
{
    private readonly SmtpOptions _options;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IOptions<SmtpOptions> options, ILogger<SmtpEmailService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_options.Host) &&
        _options.Port is > 0;

    public async Task SendEmailAsync(string to, string subject, string body, IReadOnlyList<EmailAttachment>? attachments = null)
    {
        if (!IsConfigured)
        {
            _logger.LogWarning("SMTP not configured. Skipping email to {To} with subject {Subject}", to, subject);
            return;
        }

        using var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_options.FromName, _options.FromAddress));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;

        var builder = new BodyBuilder { HtmlBody = body };

        if (attachments is not null)
        {
            foreach (var attachment in attachments)
            {
                var bytes = Convert.FromBase64String(attachment.ContentBase64);
                builder.Attachments.Add(attachment.FileName, bytes, ContentType.Parse(attachment.MediaType));
            }
        }

        message.Body = builder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_options.Host, _options.Port ?? 587, _options.UseSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTlsWhenAvailable);

        if (!string.IsNullOrWhiteSpace(_options.Username))
        {
            await client.AuthenticateAsync(_options.Username, _options.Password);
        }

        await client.SendAsync(message);
        await client.DisconnectAsync(true);

        _logger.LogInformation("Email sent to {To} with subject {Subject}", to, subject);
    }
}

public sealed record SmtpOptions
{
    public const string SectionName = "Smtp";
    public string Host { get; init; } = string.Empty;
    public int? Port { get; init; }
    public bool UseSsl { get; init; }
    public string? Username { get; init; }
    public string? Password { get; init; }
    public string FromAddress { get; init; } = "noreply@vitalflow.com";
    public string FromName { get; init; } = "VitalFlow HIS";
}
