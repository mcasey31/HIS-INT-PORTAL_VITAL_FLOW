using VitalFlow.His.Api.Application.Auth.Contracts;

namespace VitalFlow.His.Api.Application.Auth.Services;

public interface IAuthService
{
    IReadOnlyList<LoginCentroResponse> GetCentrosLogin();
    AuthTokensResponse Login(LoginRequest request, string? ip, string? userAgent);
    AuthTokensResponse Refresh(RefreshRequest request, string? ip, string? userAgent);
    void Logout(LogoutRequest request, string? ip, string? userAgent);
    CreateSystemUserResponse CreateSystemUser(CreateSystemUserRequest request, string? ip, string? userAgent);
    UpdateSystemUserResponse UpdateSystemUser(UpdateSystemUserRequest request, string? ip, string? userAgent);
    void SetSystemUserEstado(Guid userId, string estado, string? ip, string? userAgent);
    void ChangePassword(Guid userId, ChangePasswordRequest request, string? ip, string? userAgent);
}
