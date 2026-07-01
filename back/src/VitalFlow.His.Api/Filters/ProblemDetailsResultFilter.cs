using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace VitalFlow.His.Api.Filters;

public sealed class ProblemDetailsResultFilter : IAsyncResultFilter
{
    private const string ProblemJsonContentType = "application/problem+json";

    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        context.Result = NormalizeResult(context);
        await next();
    }

    private static IActionResult NormalizeResult(ResultExecutingContext context)
    {
        var requestPath = context.HttpContext.Request.Path.Value;

        if (context.Result is ObjectResult objectResult)
        {
            var statusCode = objectResult.StatusCode;
            if (!statusCode.HasValue || !IsTargetErrorStatus(statusCode.Value))
            {
                return context.Result;
            }

            if (objectResult.Value is ValidationProblemDetails validationProblem)
            {
                validationProblem.Type = $"https://httpstatuses.com/{statusCode.Value}";
                validationProblem.Instance ??= requestPath;
                return objectResult;
            }

            if (objectResult.Value is ProblemDetails)
            {
                return objectResult;
            }

            var detail = ExtractMessage(objectResult.Value);
            return BuildProblemResult(statusCode.Value, detail, requestPath);
        }

        if (context.Result is StatusCodeResult statusCodeResult && IsTargetErrorStatus(statusCodeResult.StatusCode))
        {
            return BuildProblemResult(statusCodeResult.StatusCode, null, requestPath);
        }

        return context.Result;
    }

    private static ObjectResult BuildProblemResult(int statusCode, string? detail, string? instance)
    {
        var problem = new ProblemDetails
        {
            Type = $"https://httpstatuses.com/{statusCode}",
            Title = GetDefaultTitle(statusCode),
            Status = statusCode,
            Detail = detail,
            Instance = instance
        };

        return new ObjectResult(problem)
        {
            StatusCode = statusCode,
            ContentTypes = { ProblemJsonContentType }
        };
    }

    private static bool IsTargetErrorStatus(int statusCode)
    {
        return statusCode is StatusCodes.Status400BadRequest
            or StatusCodes.Status401Unauthorized
            or StatusCodes.Status403Forbidden
            or StatusCodes.Status404NotFound
            or StatusCodes.Status500InternalServerError;
    }

    private static string? ExtractMessage(object? value)
    {
        if (value is null)
        {
            return null;
        }

        if (value is string text)
        {
            return text;
        }

        var messageProperty = value.GetType().GetProperty("message");
        if (messageProperty is null)
        {
            return null;
        }

        var rawValue = messageProperty.GetValue(value);
        return rawValue?.ToString();
    }

    private static string GetDefaultTitle(int statusCode)
    {
        return statusCode switch
        {
            StatusCodes.Status400BadRequest => "Solicitud invalida.",
            StatusCodes.Status401Unauthorized => "No autenticado.",
            StatusCodes.Status403Forbidden => "Acceso denegado.",
            StatusCodes.Status404NotFound => "Recurso no encontrado.",
            StatusCodes.Status500InternalServerError => "Error interno del servidor.",
            _ => "Error en la solicitud."
        };
    }
}
