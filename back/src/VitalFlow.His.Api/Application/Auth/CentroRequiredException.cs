namespace VitalFlow.His.Api.Application.Auth;

public sealed class CentroRequiredException : Exception
{
    public CentroRequiredException(string message) : base(message)
    {
    }
}
