using VitalFlow.His.Api.Application.Auth;
using VitalFlow.His.Api.Application.Auth.Contracts;
using VitalFlow.His.Api.Application.Auth.Repositories;
using VitalFlow.His.Api.Application.Auth.Services;
using VitalFlow.His.Api.Security;
using Xunit;

namespace VitalFlow.His.Api.Tests.Auth;

public sealed class AuthServiceTests
{
    private static readonly Guid UserId = Guid.NewGuid();
    private const string ValidPassword = "test_password_123";
    private const string Username = "testuser";
    private static readonly string PasswordHash = new Pbkdf2PasswordHasher().Hash(ValidPassword);

    private static readonly AuthUserRow AdminUser = new(
        UserId, Guid.NewGuid(), Username, PasswordHash, "ACTIVO",
        new List<string> { "Administrador" }, null);

    private static readonly AuthUserRow NonAdminUser = new(
        UserId, Guid.NewGuid(), Username, PasswordHash, "ACTIVO",
        new List<string> { "Medico" }, null);

    private static readonly AuthUserRow InactiveUser = new(
        UserId, Guid.NewGuid(), Username, PasswordHash, "INACTIVO",
        new List<string> { "Medico" }, null);

    private sealed class MockJwtTokenService : IJwtTokenService
    {
        public JwtTokenBundle CreateTokenBundle(AuthUserRow user)
        {
            return new JwtTokenBundle("access_token_mock", "refresh_token_mock", 1800, DateTimeOffset.UtcNow.AddDays(7));
        }

        public string ComputeRefreshTokenHash(string refreshToken)
        {
            return $"hash_{refreshToken}";
        }
    }

    private sealed class MockAuthRepository : IAuthRepository
    {
        private readonly AuthUserRow? _user;
        private readonly List<AuthCentroRow> _centros;
        private readonly bool _userHasCentro;
        private readonly bool _centroExists;
        private readonly AuthRefreshTokenRow? _activeRefreshToken;
        private readonly AuthRefreshTokenRow? _refreshTokenByHash;
        public List<CreateSesionLogRow> SesionLogs { get; } = new();
        public List<CreateRefreshTokenRow> CreatedRefreshTokens { get; } = new();
        public DateTimeOffset? UltimoLoginActualizado { get; private set; }

        public MockAuthRepository(
            AuthUserRow? user = null,
            List<AuthCentroRow>? centros = null,
            bool userHasCentro = true,
            bool centroExists = true,
            AuthRefreshTokenRow? activeRefreshToken = null,
            AuthRefreshTokenRow? refreshTokenByHash = null)
        {
            _user = user;
            _centros = centros ?? new List<AuthCentroRow> { new(Guid.NewGuid(), "Centro Test") };
            _userHasCentro = userHasCentro;
            _centroExists = centroExists;
            _activeRefreshToken = activeRefreshToken;
            _refreshTokenByHash = refreshTokenByHash;
        }

        public IReadOnlyList<AuthCentroRow> GetActiveCentros() => _centros;
        public AuthUserRow? GetUserByUsername(string _) => _user;
        public AuthUserRow? GetUserById(Guid _) => _user;
        public bool UserHasCentro(Guid _, Guid __) => _userHasCentro;
        public bool CentroExists(Guid _) => _centroExists;
        public AuthRefreshTokenRow? GetActiveRefreshToken(string _) => _activeRefreshToken;
        public AuthRefreshTokenRow? GetRefreshTokenByHash(string _) => _refreshTokenByHash;
        public IReadOnlyList<AuthRefreshTokenRow> GetActiveRefreshTokensByUser(Guid _) => new List<AuthRefreshTokenRow>();
        public void RevokeAllUserRefreshTokens(Guid _, DateTimeOffset __) { }
        public void InsertRefreshToken(CreateRefreshTokenRow row) => CreatedRefreshTokens.Add(row);
        public void RevokeRefreshToken(Guid _, DateTimeOffset __, string? ___) { }
        public void UpdateUltimoLogin(Guid _, DateTimeOffset loginAt) => UltimoLoginActualizado = loginAt;
        public void UpdatePassword(Guid _, string __, string ___) { }
        public void UpdateEstado(Guid _, string __) { }
        public bool PersonaExists(Guid _) => true;
        public bool ServicioExists(Guid _, Guid __) => true;
        public string? GetPersonaNombreCompleto(Guid _) => "Test User";
        public bool RolesExist(IReadOnlyList<string> _) => true;
        public void InsertSesionLog(CreateSesionLogRow row) => SesionLogs.Add(row);
        public Guid CreateSystemUser(Guid _, string __, string ___, string ____, Guid _____, Guid ______, string? _______, string? ________, bool _________, IReadOnlyList<string> __________) => Guid.NewGuid();
        public void UpdateSystemUser(Guid _, string __, string ___, Guid ____, Guid _____, string? ______, string? _______, bool ________, IReadOnlyList<string> _________) { }
    }

    [Fact]
    public void Login_WithValidAdminCredentials_ReturnsTokens()
    {
        var repo = new MockAuthRepository(user: AdminUser);
        var service = new AuthService(repo, new Pbkdf2PasswordHasher(), new MockJwtTokenService());

        var result = service.Login(new LoginRequest(Username, ValidPassword, null), null, null);

        Assert.NotNull(result);
        Assert.Equal("access_token_mock", result.AccessToken);
        Assert.Equal("refresh_token_mock", result.RefreshToken);
        Assert.Equal(Username, result.Username);
        Assert.Contains("Administrador", result.Roles);
        Assert.Equal("global", result.CentroId);
        Assert.Single(repo.CreatedRefreshTokens);
        Assert.NotNull(repo.UltimoLoginActualizado);
    }

    [Fact]
    public void Login_WithInvalidPassword_ThrowsUnauthorizedAccessException()
    {
        var repo = new MockAuthRepository(user: AdminUser);
        var service = new AuthService(repo, new Pbkdf2PasswordHasher(), new MockJwtTokenService());

        var ex = Assert.Throws<UnauthorizedAccessException>(() =>
            service.Login(new LoginRequest(Username, "wrong_password", null), null, null));

        Assert.Equal("Credenciales invalidas.", ex.Message);
        Assert.Single(repo.SesionLogs);
        Assert.Equal("FALLIDO", repo.SesionLogs[0].Resultado);
    }

    [Fact]
    public void Login_WithNonAdminAndNoCentro_ThrowsCentroRequiredException()
    {
        var repo = new MockAuthRepository(user: NonAdminUser);
        var service = new AuthService(repo, new Pbkdf2PasswordHasher(), new MockJwtTokenService());

        var ex = Assert.Throws<CentroRequiredException>(() =>
            service.Login(new LoginRequest(Username, ValidPassword, null), null, null));

        Assert.Equal("Debe seleccionar un centro para iniciar sesion.", ex.Message);
    }

    [Fact]
    public void Login_WithInactiveUser_ThrowsUnauthorizedAccessException()
    {
        var repo = new MockAuthRepository(user: InactiveUser);
        var service = new AuthService(repo, new Pbkdf2PasswordHasher(), new MockJwtTokenService());

        var ex = Assert.Throws<UnauthorizedAccessException>(() =>
            service.Login(new LoginRequest(Username, ValidPassword, null), null, null));

        Assert.Equal("Credenciales invalidas.", ex.Message);
    }

    [Fact]
    public void Login_WithNonAdminAndValidCentro_ReturnsTokens()
    {
        var centroId = Guid.NewGuid();
        var repo = new MockAuthRepository(user: NonAdminUser, userHasCentro: true, centroExists: true);
        var service = new AuthService(repo, new Pbkdf2PasswordHasher(), new MockJwtTokenService());

        var result = service.Login(new LoginRequest(Username, ValidPassword, centroId.ToString()), null, null);

        Assert.NotNull(result);
        Assert.Equal(centroId.ToString(), result.CentroId);
    }

    [Fact]
    public void Login_WithNonAdminAndInvalidCentro_ThrowsUnauthorizedAccessException()
    {
        var repo = new MockAuthRepository(user: NonAdminUser, userHasCentro: false, centroExists: true);
        var service = new AuthService(repo, new Pbkdf2PasswordHasher(), new MockJwtTokenService());

        var ex = Assert.Throws<UnauthorizedAccessException>(() =>
            service.Login(new LoginRequest(Username, ValidPassword, Guid.NewGuid().ToString()), null, null));

        Assert.Equal("El usuario no tiene acceso al centro seleccionado.", ex.Message);
    }

    [Fact]
    public void Refresh_WithValidToken_ReturnsNewTokens()
    {
        var validToken = new AuthRefreshTokenRow(
            Guid.NewGuid(), UserId, "hash_valid",
            DateTimeOffset.UtcNow.AddDays(1), null);
        var repo = new MockAuthRepository(user: AdminUser, refreshTokenByHash: validToken);
        var service = new AuthService(repo, new Pbkdf2PasswordHasher(), new MockJwtTokenService());

        var result = service.Refresh(new RefreshRequest("valid_refresh_token", null), null, null);

        Assert.NotNull(result);
        Assert.Equal("access_token_mock", result.AccessToken);
        Assert.Single(repo.CreatedRefreshTokens);
    }

    [Fact]
    public void Refresh_WithRevokedToken_ThrowsUnauthorizedAccessException()
    {
        var revokedToken = new AuthRefreshTokenRow(
            Guid.NewGuid(), UserId, "hash_revoked",
            DateTimeOffset.UtcNow.AddDays(1), DateTimeOffset.UtcNow.AddHours(-1));
        var repo = new MockAuthRepository(user: AdminUser, refreshTokenByHash: revokedToken);
        var service = new AuthService(repo, new Pbkdf2PasswordHasher(), new MockJwtTokenService());

        var ex = Assert.Throws<UnauthorizedAccessException>(() =>
            service.Refresh(new RefreshRequest("revoked_refresh_token", null), null, null));

        Assert.Equal("Refresh token invalido o expirado.", ex.Message);
    }

    [Fact]
    public void Refresh_WithExpiredToken_ThrowsUnauthorizedAccessException()
    {
        var expiredToken = new AuthRefreshTokenRow(
            Guid.NewGuid(), UserId, "hash_expired",
            DateTimeOffset.UtcNow.AddHours(-1), null);
        var repo = new MockAuthRepository(user: AdminUser, refreshTokenByHash: expiredToken);
        var service = new AuthService(repo, new Pbkdf2PasswordHasher(), new MockJwtTokenService());

        var ex = Assert.Throws<UnauthorizedAccessException>(() =>
            service.Refresh(new RefreshRequest("expired_refresh_token", null), null, null));

        Assert.Equal("Refresh token invalido o expirado.", ex.Message);
    }
}
