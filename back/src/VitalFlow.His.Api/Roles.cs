namespace VitalFlow.His.Api;

public static class Roles
{
    public const string Administrador = "Administrador";
    public const string Administrativo = "Administrativo";
    public const string Cajero = "Cajero";
    public const string Auditor = "Auditor";
    public const string Medico = "Medico";
    public const string EnrolamientoPersona = "Enrolamiento Persona";
    public const string AdministradorSeguridad = "Administrador Seguridad";

    public const string FullAccess = "Administrador,Administrativo,Cajero,Auditor,Medico";
    public const string ClinicalAccess = "Medico,Auditor,Administrador";
    public const string SecurityAccess = "Administrador Seguridad";
    public const string EnrolamientoAccess = "Administrador,Enrolamiento Persona,Medico,Auditor,Administrativo,Cajero";
    public const string AllRoles = "Administrador,Administrador Seguridad,Medico,Auditor,Administrativo,Cajero,Enrolamiento Persona";
    public const string FhirAccess = "Administrador,Administrativo,Cajero,Auditor";
    public const string RecetaAccess = "Medico,Auditor,Administrador,Administrativo,Cajero,Enrolamiento Persona";
}
