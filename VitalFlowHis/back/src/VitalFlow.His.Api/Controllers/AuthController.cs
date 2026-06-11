using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VitalFlow.His.Api.Application.Auth.Contracts;
using VitalFlow.His.Api.Application.Auth.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet("centros")]
    public ActionResult<IReadOnlyList<LoginCentroResponse>> GetCentrosLogin()
    {
        return Ok(authService.GetCentrosLogin());
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public ActionResult<AuthTokensResponse> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = authService.Login(request, HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent.ToString());
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public ActionResult<AuthTokensResponse> Refresh([FromBody] RefreshRequest request)
    {
        try
        {
            var response = authService.Refresh(request, HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent.ToString());
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    public IActionResult Logout([FromBody] LogoutRequest request)
    {
        authService.Logout(request, HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent.ToString());
        return Ok(new { message = "Sesion cerrada." });
    }

    [Authorize]
    [HttpPost("change-password")]
    public IActionResult ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId) || userId == Guid.Empty)
        {
            return Unauthorized(new { message = "Usuario autenticado invalido." });
        }

        try
        {
            authService.ChangePassword(userId, request, HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent.ToString());
            return Ok(new { message = "Contrasena actualizada correctamente." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}
