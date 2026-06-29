using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace VitalFlow.His.Api.Middleware;

public sealed class StatusCodeProblemDetailsMiddleware
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    private readonly RequestDelegate _next;

    public StatusCodeProblemDetailsMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        await _next(context);

        if (context.Response.HasStarted)
        {
            return;
        }

        if (!IsTargetErrorStatus(context.Response.StatusCode))
        {
            return;
        }

        if ((context.Response.ContentLength ?? 0) > 0)
        {
            return;
        }

        if (!string.IsNullOrWhiteSpace(context.Response.ContentType))
        {
            return;
        }

        context.Response.ContentType = "application/problem+json";

        var problem = new ProblemDetails
        {
            Type = $"https://httpstatuses.com/{context.Response.StatusCode}",
            Title = GetDefaultTitle(context.Response.StatusCode),
            Status = context.Response.StatusCode,
            Instance = context.Request.Path
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(problem, SerializerOptions));
    }

    private static bool IsTargetErrorStatus(int statusCode)
    {
        return statusCode is StatusCodes.Status401Unauthorized
            or StatusCodes.Status403Forbidden
            or StatusCodes.Status404NotFound;
    }

    private static string GetDefaultTitle(int statusCode)
    {
        return statusCode switch
        {
            StatusCodes.Status401Unauthorized => "No autenticado.",
            StatusCodes.Status403Forbidden => "Acceso denegado.",
            StatusCodes.Status404NotFound => "Recurso no encontrado.",
            _ => "Error en la solicitud."
        };
    }
}
