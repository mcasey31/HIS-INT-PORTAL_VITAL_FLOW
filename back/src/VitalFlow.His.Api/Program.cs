using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using VitalFlow.His.Api.Application.Admision.Repositories;
using VitalFlow.His.Api.Application.Admision.Services;
using VitalFlow.His.Api.Application.Auth.Repositories;
using VitalFlow.His.Api.Application.Auth.Services;
using VitalFlow.His.Api.Application.Agenda.Services;
using VitalFlow.His.Api.Application.EstructuraInterna.Repositories;
using VitalFlow.His.Api.Application.EstructuraInterna.Services;
using VitalFlow.His.Api.Application.Fhir.Services;
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
using VitalFlow.His.Api.Infrastructure.Medicamento;
using VitalFlow.His.Api.Application.Medicamento.Repositories;
using VitalFlow.His.Api.Application.Medicamento.Services;
using VitalFlow.His.Api.Infrastructure.Prescripcion;
using VitalFlow.His.Api.Application.Prescripcion.Services;
using VitalFlow.His.Api.Infrastructure.BackgroundServices;
using VitalFlow.His.Api.Middleware;
using VitalFlow.His.Api.Security;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ProblemDetailsResultFilter>();
    options.Filters.Add(new AuthorizeFilter());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

var jwtSigningKey = builder.Configuration["Jwt:SigningKey"]
    ?? throw new InvalidOperationException("Jwt:SigningKey is required. Configure it via environment variable or user-secrets.");

if (Encoding.UTF8.GetByteCount(jwtSigningKey) < 32)
    throw new InvalidOperationException("Jwt:SigningKey must be at least 256 bits (32+ characters).");
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
builder.Services.AddScoped<IMedicamentoRepository>(_ =>
{
    var cs = builder.Configuration.GetConnectionString("VitalFlowHisDb")
        ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");
    return new PostgresMedicamentoRepository(cs);
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
builder.Services.AddScoped<IMedicamentoService, MedicamentoService>();
builder.Services.AddScoped<PostgresPrescripcionRepository>(_ =>
{
    var cs = builder.Configuration.GetConnectionString("VitalFlowHisDb")
        ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");
    return new PostgresPrescripcionRepository(cs);
});
builder.Services.AddScoped<IPrescripcionService, PrescripcionService>();
builder.Services.AddScoped<IFhirService, FhirService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHostedService<ClearingDiarioBackgroundService>();

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(RateLimitingPolicies.Auth, opt =>
    {
        opt.PermitLimit = 10;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });

    options.AddFixedWindowLimiter(RateLimitingPolicies.Default, opt =>
    {
        opt.PermitLimit = 200;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 5;
    });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseRateLimiter();

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
app.UseMiddleware<RequestAuditMiddleware>();

app.MapControllers();

app.Run();
