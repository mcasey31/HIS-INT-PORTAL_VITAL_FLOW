using VitalFlow.His.Api.Application.Auth.Contracts;
using VitalFlow.His.Api.Application.Auth.Repositories;
using VitalFlow.His.Api.Security;
using System.Text.RegularExpressions;

namespace VitalFlow.His.Api.Application.Auth.Services;

public sealed class AuthService(
    IAuthRepository authRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService) : IAuthService
{
    private const string EstadoActivo = "ACTIVO";
    private const string EstadoDebeCambiarPassword = "DEBE_CAMBIAR_PASSWORD";
    private const string EstadoInactivo = "INACTIVO";
    private static readonly Regex MatriculaProvincialRegex = new("^MP[0-9A-Za-z]{2,}$", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex MatriculaNacionalRegex = new("^MN[0-9A-Za-z]{2,}$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public IReadOnlyList<LoginCentroResponse> GetCentrosLogin()
    {
        return authRepository.GetActiveCentros()
            .Select(c => new LoginCentroResponse(c.Id.ToString(), c.Nombre))
            .ToArray();
    }

    public AuthTokensResponse Login(LoginRequest request, string? ip, string? userAgent)
    {
        Console.WriteLine($"DEBUG: Login() called with username={request.Username}");
        var username = (request.Username ?? string.Empty).Trim();
        var password = request.Password ?? string.Empty;

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("username y password son obligatorios.");
        }

        var user = authRepository.GetUserByUsername(username);
        Console.WriteLine($"DEBUG: GetUserByUsername('{username}') returned: {(user is null ? "NULL" : $"User {user.Username} Estado={user.Estado}")}");
        
        if (user is not null)
        {
            var passwordValid = passwordHasher.Verify(password, user.PasswordHash);
            Console.WriteLine($"DEBUG: passwordHasher.Verify('{password}', hash) = {passwordValid}");
            var canLogin = CanLogin(user.Estado);
            Console.WriteLine($"DEBUG: CanLogin('{user.Estado}') = {canLogin}");
        }

        if (user is null || !passwordHasher.Verify(password, user.PasswordHash) || !CanLogin(user.Estado))
        {
            authRepository.InsertSesionLog(new CreateSesionLogRow(
                Guid.NewGuid(),
                user?.Id,
                "LOGIN",
                ip,
                userAgent,
                "FALLIDO"));

            throw new UnauthorizedAccessException("Credenciales invalidas.");
        }

        user = ResolveCentroLogin(user, request.CentroId);

        var tokenBundle = jwtTokenService.CreateTokenBundle(user);
        var refreshHash = jwtTokenService.ComputeRefreshTokenHash(tokenBundle.RefreshToken);

        authRepository.InsertRefreshToken(new CreateRefreshTokenRow(
            Guid.NewGuid(),
            user.Id,
            refreshHash,
            tokenBundle.RefreshTokenExpiresAt,
            ip,
            userAgent));

        authRepository.UpdateUltimoLogin(user.Id, DateTimeOffset.UtcNow);

        authRepository.InsertSesionLog(new CreateSesionLogRow(
            Guid.NewGuid(),
            user.Id,
            "LOGIN",
            ip,
            userAgent,
            "EXITOSO"));

        return new AuthTokensResponse(
            tokenBundle.AccessToken,
            tokenBundle.RefreshToken,
            "Bearer",
            tokenBundle.ExpiresInSeconds,
            user.Username,
            user.Roles,
            user.CentroId ?? "global",
            string.Equals(user.Estado, EstadoDebeCambiarPassword, StringComparison.OrdinalIgnoreCase));
    }

    public AuthTokensResponse Refresh(RefreshRequest request, string? ip, string? userAgent)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            throw new ArgumentException("refreshToken es obligatorio.");
        }

        var currentHash = jwtTokenService.ComputeRefreshTokenHash(request.RefreshToken.Trim());

        var existingToken = authRepository.GetRefreshTokenByHash(currentHash);

        if (existingToken is null)
        {
            authRepository.InsertSesionLog(new CreateSesionLogRow(
                Guid.NewGuid(),
                null,
                "REFRESH",
                ip,
                userAgent,
                "FALLIDO"));

            throw new UnauthorizedAccessException("Refresh token invalido o expirado.");
        }

        if (existingToken.RevokedAt is not null)
        {
            authRepository.RevokeAllUserRefreshTokens(existingToken.UsuarioId, DateTimeOffset.UtcNow);

            authRepository.InsertSesionLog(new CreateSesionLogRow(
                Guid.NewGuid(),
                existingToken.UsuarioId,
                "REFRESH_REPLAY_DETECTED",
                ip,
                userAgent,
                "FALLIDO"));

            throw new UnauthorizedAccessException("Refresh token invalido o expirado.");
        }

        if (existingToken.ExpiresAt <= DateTimeOffset.UtcNow)
        {
            authRepository.InsertSesionLog(new CreateSesionLogRow(
                Guid.NewGuid(),
                existingToken.UsuarioId,
                "REFRESH",
                ip,
                userAgent,
                "FALLIDO"));

            throw new UnauthorizedAccessException("Refresh token invalido o expirado.");
        }

        var user = authRepository.GetUserById(existingToken.UsuarioId);
        if (user is null || !CanLogin(user.Estado))
        {
            authRepository.InsertSesionLog(new CreateSesionLogRow(
                Guid.NewGuid(),
                existingToken.UsuarioId,
                "REFRESH",
                ip,
                userAgent,
                "FALLIDO"));

            throw new UnauthorizedAccessException("Usuario no autorizado.");
        }

        user = ResolveCentroLogin(user, request.CentroId);

        var tokenBundle = jwtTokenService.CreateTokenBundle(user);
        var newRefreshHash = jwtTokenService.ComputeRefreshTokenHash(tokenBundle.RefreshToken);

        authRepository.RevokeRefreshToken(existingToken.Id, DateTimeOffset.UtcNow, newRefreshHash);

        authRepository.InsertRefreshToken(new CreateRefreshTokenRow(
            Guid.NewGuid(),
            user.Id,
            newRefreshHash,
            tokenBundle.RefreshTokenExpiresAt,
            ip,
            userAgent));

        authRepository.InsertSesionLog(new CreateSesionLogRow(
            Guid.NewGuid(),
            user.Id,
            "REFRESH",
            ip,
            userAgent,
            "EXITOSO"));

        return new AuthTokensResponse(
            tokenBundle.AccessToken,
            tokenBundle.RefreshToken,
            "Bearer",
            tokenBundle.ExpiresInSeconds,
            user.Username,
            user.Roles,
            user.CentroId ?? "global",
            string.Equals(user.Estado, EstadoDebeCambiarPassword, StringComparison.OrdinalIgnoreCase));
    }

    private AuthUserRow ResolveCentroLogin(AuthUserRow user, string? centroIdRaw)
    {
        var esAdministrador = user.Roles.Any(role => string.Equals(role, "Administrador", StringComparison.OrdinalIgnoreCase));

        if (string.IsNullOrWhiteSpace(centroIdRaw))
        {
            if (esAdministrador)
            {
                return user with { CentroId = "global" };
            }

            throw new CentroRequiredException("Debe seleccionar un centro para iniciar sesion.");
        }

        if (string.Equals(centroIdRaw.Trim(), "global", StringComparison.OrdinalIgnoreCase))
        {
            if (esAdministrador)
            {
                return user with { CentroId = "global" };
            }

            throw new UnauthorizedAccessException("El usuario no tiene acceso al centro seleccionado.");
        }

        if (!Guid.TryParse(centroIdRaw.Trim(), out var centroId) || centroId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("Centro invalido.");
        }

        var centroHabilitado = esAdministrador
            ? authRepository.CentroExists(centroId)
            : authRepository.UserHasCentro(user.Id, centroId);

        if (!centroHabilitado)
        {
            throw new UnauthorizedAccessException("El usuario no tiene acceso al centro seleccionado.");
        }

        return user with { CentroId = centroId.ToString() };
    }

    public void Logout(LogoutRequest request, string? ip, string? userAgent)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            throw new ArgumentException("refreshToken es obligatorio.");
        }

        var refreshHash = jwtTokenService.ComputeRefreshTokenHash(request.RefreshToken.Trim());
        var activeToken = authRepository.GetActiveRefreshToken(refreshHash);

        if (activeToken is not null)
        {
            authRepository.RevokeRefreshToken(activeToken.Id, DateTimeOffset.UtcNow, null);
        }

        authRepository.InsertSesionLog(new CreateSesionLogRow(
            Guid.NewGuid(),
            activeToken?.UsuarioId,
            "LOGOUT",
            ip,
            userAgent,
            "EXITOSO"));
    }

    public CreateSystemUserResponse CreateSystemUser(CreateSystemUserRequest request, string? ip, string? userAgent)
    {
        var username = (request.Username ?? string.Empty).Trim();
        var temporaryPassword = request.TemporaryPassword ?? string.Empty;
        var matriculaProvincial = NormalizeNullable(request.MatriculaProvincial);
        var matriculaNacional = NormalizeNullable(request.MatriculaNacional);
        var roles = request.Roles
            .Where(role => !string.IsNullOrWhiteSpace(role))
            .Select(role => role.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        if (request.PersonaId == Guid.Empty)
        {
            throw new ArgumentException("personaId es obligatorio.");
        }

        var allCentros = request.CentroId == Guid.Empty;

        if (string.IsNullOrWhiteSpace(username))
        {
            throw new ArgumentException("username es obligatorio.");
        }

        if (roles.Length == 0)
        {
            throw new ArgumentException("Debe indicar al menos un rol.");
        }

        if (temporaryPassword.Length < 8)
        {
            throw new ArgumentException("La contrasena temporal debe tener al menos 8 caracteres.");
        }

        if (!authRepository.PersonaExists(request.PersonaId))
        {
            throw new InvalidOperationException("La persona indicada no existe en el sistema.");
        }

        var esMedico = roles.Any(role => string.Equals(role, "Medico", StringComparison.OrdinalIgnoreCase));

        if (!allCentros && !authRepository.CentroExists(request.CentroId))
        {
            throw new InvalidOperationException("El centro indicado no existe en el sistema.");
        }

        if (esMedico)
        {
            if (allCentros)
            {
                throw new InvalidOperationException("El rol Medico requiere un centro especifico.");
            }

            if (request.ServicioId == Guid.Empty)
            {
                throw new InvalidOperationException("El rol Medico requiere un servicio.");
            }

            if (!authRepository.ServicioExists(request.CentroId, request.ServicioId))
            {
                throw new InvalidOperationException("El servicio indicado no existe o no pertenece al centro seleccionado.");
            }

            EnsureMatriculaValida(matriculaProvincial, matriculaNacional);
        }
        else if (request.ServicioId != Guid.Empty)
        {
            throw new InvalidOperationException("Solo el rol Medico puede asociarse a un servicio.");
        }

        if (!esMedico && (!string.IsNullOrWhiteSpace(matriculaProvincial) || !string.IsNullOrWhiteSpace(matriculaNacional)))
        {
            throw new InvalidOperationException("Solo el rol Medico puede informar matriculas.");
        }

        if (!authRepository.RolesExist(roles))
        {
            throw new InvalidOperationException("Uno o mas roles indicados no existen.");
        }

        if (authRepository.GetUserByUsername(username) is not null)
        {
            throw new ArgumentException("Ya existe un usuario con ese username.");
        }

        var passwordHash = passwordHasher.Hash(temporaryPassword);
        var userId = authRepository.CreateSystemUser(request.PersonaId, username, passwordHash, EstadoDebeCambiarPassword, request.CentroId, request.ServicioId, matriculaProvincial, matriculaNacional, allCentros, roles);

        authRepository.InsertSesionLog(new CreateSesionLogRow(
            Guid.NewGuid(),
            userId,
            "USER_CREATE",
            ip,
            userAgent,
            "EXITOSO"));

        return new CreateSystemUserResponse(userId, request.PersonaId, username, request.CentroId, request.ServicioId, matriculaProvincial, matriculaNacional, roles, EstadoDebeCambiarPassword);
    }

    public UpdateSystemUserResponse UpdateSystemUser(UpdateSystemUserRequest request, string? ip, string? userAgent)
    {
        if (request.UserId == Guid.Empty)
        {
            throw new ArgumentException("userId es obligatorio.");
        }

        if (request.PersonaId == Guid.Empty)
        {
            throw new ArgumentException("personaId es obligatorio.");
        }

        var username = (request.Username ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(username))
        {
            throw new ArgumentException("username es obligatorio.");
        }

        var estado = (request.Estado ?? string.Empty).Trim().ToUpperInvariant();
        var matriculaProvincial = NormalizeNullable(request.MatriculaProvincial);
        var matriculaNacional = NormalizeNullable(request.MatriculaNacional);
        if (estado != EstadoActivo && estado != EstadoInactivo)
        {
            throw new ArgumentException("estado debe ser ACTIVO o INACTIVO.");
        }

        var roles = request.Roles
            .Where(role => !string.IsNullOrWhiteSpace(role))
            .Select(role => role.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        if (roles.Length == 0)
        {
            throw new ArgumentException("Debe indicar al menos un rol.");
        }

        var existingUser = authRepository.GetUserById(request.UserId)
            ?? throw new InvalidOperationException("El usuario indicado no existe en el sistema.");

        if (!existingUser.PersonaId.HasValue || existingUser.PersonaId.Value != request.PersonaId)
        {
            throw new InvalidOperationException("La persona del usuario no coincide con el registro seleccionado.");
        }

        var userWithSameUsername = authRepository.GetUserByUsername(username);
        if (userWithSameUsername is not null && userWithSameUsername.Id != request.UserId)
        {
            throw new ArgumentException("Ya existe un usuario con ese username.");
        }

        var allCentros = request.CentroId == Guid.Empty;
        var esMedico = roles.Any(role => string.Equals(role, "Medico", StringComparison.OrdinalIgnoreCase));

        if (!allCentros && !authRepository.CentroExists(request.CentroId))
        {
            throw new InvalidOperationException("El centro indicado no existe en el sistema.");
        }

        if (esMedico)
        {
            if (allCentros)
            {
                throw new InvalidOperationException("El rol Medico requiere un centro especifico.");
            }

            if (request.ServicioId == Guid.Empty)
            {
                throw new InvalidOperationException("El rol Medico requiere un servicio.");
            }

            if (!authRepository.ServicioExists(request.CentroId, request.ServicioId))
            {
                throw new InvalidOperationException("El servicio indicado no existe o no pertenece al centro seleccionado.");
            }

            EnsureMatriculaValida(matriculaProvincial, matriculaNacional);
        }
        else if (request.ServicioId != Guid.Empty)
        {
            throw new InvalidOperationException("Solo el rol Medico puede asociarse a un servicio.");
        }

        if (!esMedico && (!string.IsNullOrWhiteSpace(matriculaProvincial) || !string.IsNullOrWhiteSpace(matriculaNacional)))
        {
            throw new InvalidOperationException("Solo el rol Medico puede informar matriculas.");
        }

        if (!authRepository.RolesExist(roles))
        {
            throw new InvalidOperationException("Uno o mas roles indicados no existen.");
        }

        authRepository.UpdateSystemUser(request.UserId, username, estado, request.CentroId, request.ServicioId, matriculaProvincial, matriculaNacional, allCentros, roles);

        authRepository.InsertSesionLog(new CreateSesionLogRow(
            Guid.NewGuid(),
            request.UserId,
            "USER_UPDATE",
            ip,
            userAgent,
            "EXITOSO"));

        return new UpdateSystemUserResponse(
            request.UserId,
            request.PersonaId,
            username,
            request.CentroId,
            request.ServicioId,
                matriculaProvincial,
                matriculaNacional,
            roles,
            estado);
    }

    public void SetSystemUserEstado(Guid userId, string estado, string? ip, string? userAgent)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("userId es obligatorio.");
        }

        var normalized = (estado ?? string.Empty).Trim().ToUpperInvariant();
        if (normalized != EstadoActivo && normalized != EstadoInactivo)
        {
            throw new ArgumentException("estado debe ser ACTIVO o INACTIVO.");
        }

        authRepository.UpdateEstado(userId, normalized);

        authRepository.InsertSesionLog(new CreateSesionLogRow(
            Guid.NewGuid(),
            userId,
            "USER_STATUS_UPDATE",
            ip,
            userAgent,
            "EXITOSO"));
    }

    public void ChangePassword(Guid userId, ChangePasswordRequest request, string? ip, string? userAgent)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Usuario invalido.");
        }

        if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
        {
            throw new ArgumentException("CurrentPassword y NewPassword son obligatorios.");
        }

        if (request.NewPassword.Length < 8)
        {
            throw new ArgumentException("La nueva contrasena debe tener al menos 8 caracteres.");
        }

        var user = authRepository.GetUserById(userId);
        if (user is null)
        {
            throw new UnauthorizedAccessException("Usuario no encontrado.");
        }

        if (!passwordHasher.Verify(request.CurrentPassword, user.PasswordHash))
        {
            authRepository.InsertSesionLog(new CreateSesionLogRow(
                Guid.NewGuid(),
                userId,
                "CHANGE_PASSWORD",
                ip,
                userAgent,
                "FALLIDO"));

            throw new UnauthorizedAccessException("Contrasena actual invalida.");
        }

        var newHash = passwordHasher.Hash(request.NewPassword);
        authRepository.UpdatePassword(userId, newHash, EstadoActivo);

        authRepository.InsertSesionLog(new CreateSesionLogRow(
            Guid.NewGuid(),
            userId,
            "CHANGE_PASSWORD",
            ip,
            userAgent,
            "EXITOSO"));
    }

    private static bool CanLogin(string estado)
    {
        return string.Equals(estado, EstadoActivo, StringComparison.OrdinalIgnoreCase)
            || string.Equals(estado, EstadoDebeCambiarPassword, StringComparison.OrdinalIgnoreCase);
    }

    private static string? NormalizeNullable(string? value)
    {
        var trimmed = (value ?? string.Empty).Trim().ToUpperInvariant();
        return trimmed.Length == 0 ? null : trimmed;
    }

    private static void EnsureMatriculaValida(string? matriculaProvincial, string? matriculaNacional)
    {
        if (string.IsNullOrWhiteSpace(matriculaProvincial) && string.IsNullOrWhiteSpace(matriculaNacional))
        {
            throw new InvalidOperationException("Para rol Medico debe informar Matricula Provincial (MP...) o Matricula Nacional (MN...).");
        }

        if (!string.IsNullOrWhiteSpace(matriculaProvincial) && !MatriculaProvincialRegex.IsMatch(matriculaProvincial))
        {
            throw new InvalidOperationException("Matricula Provincial invalida. Debe comenzar con MP.");
        }

        if (!string.IsNullOrWhiteSpace(matriculaNacional) && !MatriculaNacionalRegex.IsMatch(matriculaNacional))
        {
            throw new InvalidOperationException("Matricula Nacional invalida. Debe comenzar con MN.");
        }
    }
}
