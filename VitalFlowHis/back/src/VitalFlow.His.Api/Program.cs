using VitalFlow.His.Api.Application.Admision.Repositories;
using VitalFlow.His.Api.Application.Admision.Services;
using VitalFlow.His.Api.Application.Auth.Repositories;
using VitalFlow.His.Api.Application.Auth.Services;
using VitalFlow.His.Api.Application.Agenda.Services;
using VitalFlow.His.Api.Application.EstructuraInterna.Repositories;
using VitalFlow.His.Api.Application.EstructuraInterna.Services;
using VitalFlow.His.Api.Application.HistoriaClinica.Repositories;
using VitalFlow.His.Api.Application.HistoriaClinica.Services;
using VitalFlow.His.Api.Application.Personas.Repositories;
using VitalFlow.His.Api.Application.Personas.Services;
using VitalFlow.His.Api.Application.Turnos.Repositories;
using VitalFlow.His.Api.Application.Turnos.Services;
using VitalFlow.His.Api.Domain.Agenda;
using VitalFlow.His.Api.Filters;
using VitalFlow.His.Api.Infrastructure.Admision;
using VitalFlow.His.Api.Infrastructure.Auth;
using VitalFlow.His.Api.Infrastructure.Agenda;
using VitalFlow.His.Api.Infrastructure.EstructuraInterna;
using VitalFlow.His.Api.Infrastructure.HistoriaClinica;
using VitalFlow.His.Api.Infrastructure.Personas;
using VitalFlow.His.Api.Infrastructure.Turnos;
using VitalFlow.His.Api.Middleware;
using VitalFlow.His.Api.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ProblemDetailsResultFilter>();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

var jwtSigningKey = builder.Configuration["Jwt:SigningKey"]
    ?? throw new InvalidOperationException("Jwt:SigningKey is required. Configure it via environment variable or user-secrets.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "VitalFlow.His.Api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "VitalFlow.His.Frontend";

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSigningKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCors", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://127.0.0.1:5175")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IAgendaRepository>(_ =>
{
    var connectionString = builder.Configuration.GetConnectionString("VitalFlowHisDb")
        ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");
    return new PostgresAgendaRepository(connectionString);
});
builder.Services.AddScoped<IPersonaRepository>(_ =>
{
    var connectionString = builder.Configuration.GetConnectionString("VitalFlowHisDb")
        ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");
    return new PostgresPersonaRepository(connectionString);
});
builder.Services.AddScoped<IEstructuraInternaRepository>(_ =>
{
    var connectionString = builder.Configuration.GetConnectionString("VitalFlowHisDb")
        ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");
    return new PostgresEstructuraInternaRepository(connectionString);
});
builder.Services.AddScoped<IHistoriaClinicaRepository>(_ =>
{
    var connectionString = builder.Configuration.GetConnectionString("VitalFlowHisDb")
        ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");
    return new PostgresHistoriaClinicaRepository(connectionString);
});
builder.Services.AddScoped<IAdmisionRepository>(_ =>
{
    var cs = builder.Configuration.GetConnectionString("VitalFlowHisDb")
        ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");
    return new PostgresAdmisionRepository(cs);
});
builder.Services.AddScoped<ITurnosRepository>(_ =>
{
    var cs = builder.Configuration.GetConnectionString("VitalFlowHisDb")
        ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");
    return new PostgresTurnosRepository(cs);
});
builder.Services.AddScoped<IAuthRepository>(_ =>
{
    var cs = builder.Configuration.GetConnectionString("VitalFlowHisDb")
        ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");
    return new PostgresAuthRepository(cs);
});
builder.Services.AddScoped<IAgendaService, AgendaService>();
builder.Services.AddScoped<IAdmisionService, AdmisionService>();
builder.Services.AddScoped<IEstructuraInternaService, EstructuraInternaService>();
builder.Services.AddScoped<IHistoriaClinicaService, HistoriaClinicaService>();
builder.Services.AddScoped<IPersonaService, PersonaService>();
builder.Services.AddScoped<ITurnosService, TurnosService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<StatusCodeProblemDetailsMiddleware>();
app.UseCors("FrontendCors");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
