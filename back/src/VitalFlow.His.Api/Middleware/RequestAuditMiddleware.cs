using System.Diagnostics;

namespace VitalFlow.His.Api.Middleware;

public sealed class RequestAuditMiddleware
{
    private static readonly HashSet<string> AuditedPaths =
    [
        "/api/v1/auth/login",
        "/api/v1/auth/refresh",
        "/api/v1/auth/logout",
        "/api/v1/auth/change-password"
    ];

    private readonly RequestDelegate _next;
    private readonly ILogger<RequestAuditMiddleware> _logger;

    public RequestAuditMiddleware(RequestDelegate next, ILogger<RequestAuditMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        var path = context.Request.Path.Value?.TrimEnd('/').ToLowerInvariant() ?? string.Empty;

        if (!AuditedPaths.Contains(path))
        {
            await _next(context);
            return;
        }

        var sw = Stopwatch.StartNew();
        var userId = context.User.FindFirst("userId")?.Value ?? "(anonymous)";
        var method = context.Request.Method;
        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "(unknown)";
        var userAgent = context.Request.Headers.UserAgent.ToString();

        await _next(context);

        sw.Stop();
        var statusCode = context.Response.StatusCode;

        _logger.LogInformation(
            "AUDIT: {Method} {Path} -> {StatusCode} | User: {UserId} | IP: {Ip} | Agent: {UserAgent} | Elapsed: {Elapsed}ms",
            method, path, statusCode, userId, ip, userAgent, sw.ElapsedMilliseconds);
    }
}
