using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using VitalFlow.His.Api.Application.Auth.Repositories;

namespace VitalFlow.His.Api.Security;

public sealed class JwtTokenService : IJwtTokenService
{
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _accessTokenMinutes;
    private readonly int _refreshTokenMinutes;
    private readonly SigningCredentials _signingCredentials;

    public JwtTokenService(IConfiguration configuration)
    {
        var signingKey = configuration["Jwt:SigningKey"];
        if (string.IsNullOrWhiteSpace(signingKey))
        {
            throw new InvalidOperationException("Jwt:SigningKey is required. Configure it via environment variable or user-secrets.");
        }

        _issuer = configuration["Jwt:Issuer"] ?? "VitalFlow.His.Api";
        _audience = configuration["Jwt:Audience"] ?? "VitalFlow.His.Frontend";
        _accessTokenMinutes = ParsePositiveInt(configuration["Jwt:AccessTokenMinutes"], 30);
        _refreshTokenMinutes = ParsePositiveInt(configuration["Jwt:RefreshTokenMinutes"], 7 * 24 * 60);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
        _signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    }

    public JwtTokenBundle CreateTokenBundle(AuthUserRow user)
    {
        var issuedAt = DateTimeOffset.UtcNow;
        var accessExpiresAt = issuedAt.AddMinutes(_accessTokenMinutes);
        var refreshExpiresAt = issuedAt.AddMinutes(_refreshTokenMinutes);

        var centroId = string.IsNullOrWhiteSpace(user.CentroId) ? "global" : user.CentroId;

        var claims = new List<Claim>
        {
            new("userId", user.Id.ToString()),
            new("username", user.Username),
            new(ClaimTypes.Name, user.Username),
            new("centroId", centroId)
        };

        if (user.PersonaId.HasValue && user.PersonaId.Value != Guid.Empty)
        {
            claims.Add(new Claim("personaId", user.PersonaId.Value.ToString()));
        }

        claims.AddRange(user.Roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var jwt = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            notBefore: issuedAt.UtcDateTime,
            expires: accessExpiresAt.UtcDateTime,
            signingCredentials: _signingCredentials);

        var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
        var refreshToken = GenerateRefreshToken();

        return new JwtTokenBundle(
            accessToken,
            refreshToken,
            (long)Math.Round((accessExpiresAt - issuedAt).TotalSeconds),
            refreshExpiresAt);
    }

    public string ComputeRefreshTokenHash(string refreshToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken));
        return Convert.ToHexString(bytes);
    }

    private static string GenerateRefreshToken()
    {
        var buffer = new byte[48];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(buffer);
        return Convert.ToBase64String(buffer);
    }

    private static int ParsePositiveInt(string? raw, int fallback)
    {
        return int.TryParse(raw, out var value) && value > 0 ? value : fallback;
    }
}
