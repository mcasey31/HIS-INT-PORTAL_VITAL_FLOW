using VitalFlow.His.Api.Application.Auth.Repositories;

namespace VitalFlow.His.Api.Security;

public interface IJwtTokenService
{
    JwtTokenBundle CreateTokenBundle(AuthUserRow user);
    string ComputeRefreshTokenHash(string refreshToken);
}

public sealed record JwtTokenBundle(
    string AccessToken,
    string RefreshToken,
    long ExpiresInSeconds,
    DateTimeOffset RefreshTokenExpiresAt
);
