namespace VitalFlow.His.Api.Application.Auth.Repositories;

public interface IAuthRepository
{
    IReadOnlyList<AuthCentroRow> GetActiveCentros();
    AuthUserRow? GetUserByUsername(string username);
    AuthUserRow? GetUserById(Guid userId);
    bool UserHasCentro(Guid userId, Guid centroId);
    AuthRefreshTokenRow? GetActiveRefreshToken(string tokenHash);
    void InsertRefreshToken(CreateRefreshTokenRow row);
    void RevokeRefreshToken(Guid tokenId, DateTimeOffset revokedAt, string? replacedByTokenHash);
    void UpdateUltimoLogin(Guid userId, DateTimeOffset loginAt);
    void UpdatePassword(Guid userId, string passwordHash, string estado);
    void UpdateEstado(Guid userId, string estado);
    bool PersonaExists(Guid personaId);
    bool CentroExists(Guid centroId);
    bool ServicioExists(Guid centroId, Guid servicioId);
    string? GetPersonaNombreCompleto(Guid personaId);
    bool RolesExist(IReadOnlyList<string> roleNames);
    Guid CreateSystemUser(Guid personaId, string username, string passwordHash, string estado, Guid centroId, Guid servicioId, string? matriculaProvincial, string? matriculaNacional, bool allCentros, IReadOnlyList<string> roleNames);
    void UpdateSystemUser(Guid userId, string username, string estado, Guid centroId, Guid servicioId, string? matriculaProvincial, string? matriculaNacional, bool allCentros, IReadOnlyList<string> roleNames);
    void InsertSesionLog(CreateSesionLogRow row);
}

public sealed record AuthUserRow(
    Guid Id,
    Guid? PersonaId,
    string Username,
    string PasswordHash,
    string Estado,
    IReadOnlyList<string> Roles,
    string? CentroId
);

public sealed record AuthCentroRow(Guid Id, string Nombre);

public sealed record AuthRefreshTokenRow(
    Guid Id,
    Guid UsuarioId,
    string TokenHash,
    DateTimeOffset ExpiresAt,
    DateTimeOffset? RevokedAt
);

public sealed record CreateRefreshTokenRow(
    Guid Id,
    Guid UsuarioId,
    string TokenHash,
    DateTimeOffset ExpiresAt,
    string? CreatedIp,
    string? UserAgent
);

public sealed record CreateSesionLogRow(
    Guid Id,
    Guid? UsuarioId,
    string Accion,
    string? Ip,
    string? UserAgent,
    string Resultado
);
