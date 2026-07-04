namespace VitalFlow.His.Api.Application.Auth.Contracts;

public sealed record LoginRequest(string Username, string Password, string? CentroId);

public sealed record RefreshRequest(string RefreshToken, string? CentroId);

public sealed record LogoutRequest(string RefreshToken);

public sealed record LoginCentroResponse(string Id, string Nombre);

public sealed record AuthTokensResponse(
    string AccessToken,
    string RefreshToken,
    string TokenType,
    long ExpiresInSeconds,
    string Username,
    IReadOnlyList<string> Roles,
    string CentroId,
    bool MustChangePassword
);

public sealed record CreateSystemUserRequest(
    Guid PersonaId,
    string Username,
    string TemporaryPassword,
    Guid CentroId,
    Guid ServicioId,
    string? MatriculaProvincial,
    string? MatriculaNacional,
    IReadOnlyList<string> Roles
);

public sealed record CreateSystemUserResponse(
    Guid UserId,
    Guid PersonaId,
    string Username,
    Guid CentroId,
    Guid ServicioId,
    string? MatriculaProvincial,
    string? MatriculaNacional,
    IReadOnlyList<string> Roles,
    string Estado
);

public sealed record UpdateSystemUserRequest(
    Guid UserId,
    Guid PersonaId,
    string Username,
    Guid CentroId,
    Guid ServicioId,
    string? MatriculaProvincial,
    string? MatriculaNacional,
    IReadOnlyList<string> Roles,
    string Estado,
    string? TemporaryPassword = null
);

public sealed record UpdateSystemUserResponse(
    Guid UserId,
    Guid PersonaId,
    string Username,
    Guid CentroId,
    Guid ServicioId,
    string? MatriculaProvincial,
    string? MatriculaNacional,
    IReadOnlyList<string> Roles,
    string Estado
);

public sealed record ChangePasswordRequest(string CurrentPassword, string NewPassword);
