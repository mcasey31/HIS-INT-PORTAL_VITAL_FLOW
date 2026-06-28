using System.Globalization;
using System.Text;
using VitalFlow.His.Api.Application.Personas.Contracts;

namespace VitalFlow.His.Api.Application.Personas.Domain;

public static class PersonaMatchingEngine
{
    private const int PesoTipoDocumento = 20;
    private const int PesoNumeroDocumento = 20;
    private const int PesoNombre = 20;
    private const int PesoApellido = 20;
    private const int PesoFechaNacimiento = 10;
    private const int PesoSexoBiologico = 10;

    public static int CalcularPorcentajeCoincidencia(BuscarPersonaSetMinimoRequest request, PersonaCandidataResponse candidato)
    {
        var score = 0;

        if (NormalizarTexto(request.TipoDocumento) == NormalizarTexto(candidato.TipoDocumento))
        {
            score += PesoTipoDocumento;
        }

        if (CoincideNumeroDocumento(request.TipoDocumento, request.NumeroDocumento, candidato.TipoDocumento, candidato.NumeroDocumento))
        {
            score += PesoNumeroDocumento;
        }

        var nombreCandidato = ObtenerNombreDeApellidosNombres(candidato.ApellidosNombres);
        if (NormalizarTexto(request.Nombre) == NormalizarTexto(nombreCandidato))
        {
            score += PesoNombre;
        }

        var apellidoCandidato = ObtenerApellidoDeApellidosNombres(candidato.ApellidosNombres);
        if (NormalizarTexto(request.Apellido) == NormalizarTexto(apellidoCandidato))
        {
            score += PesoApellido;
        }

        if (request.FechaNacimiento == candidato.FechaNacimiento)
        {
            score += PesoFechaNacimiento;
        }

        if (NormalizarSexo(request.SexoBiologico) == NormalizarSexo(candidato.SexoBiologico))
        {
            score += PesoSexoBiologico;
        }

        return score;
    }

    public static bool CoincideNumeroDocumento(string tipoInput, string numeroInput, string tipoCandidato, string numeroCandidato)
    {
        var tipoIn = NormalizarTexto(tipoInput);
        var tipoCand = NormalizarTexto(tipoCandidato);
        if (tipoIn != tipoCand)
        {
            return false;
        }

        var nroIn = NormalizarTexto(numeroInput);
        var nroCand = NormalizarTexto(numeroCandidato);
        if (nroIn == nroCand)
        {
            return true;
        }

        if (tipoIn == "DNI")
        {
            return NormalizarNumeroDocumentoDni(nroIn) == NormalizarNumeroDocumentoDni(nroCand);
        }

        return false;
    }

    public static string NormalizarNumeroDocumentoDni(string value)
    {
        var raw = NormalizarTexto(value);
        if (raw.Length > 1 && EmpiezaConMf(raw))
        {
            return raw[1..];
        }

        return raw;
    }

    public static string NormalizarTexto(string value)
    {
        var input = (value ?? string.Empty).Trim().ToUpperInvariant();
        if (input.Length == 0)
        {
            return string.Empty;
        }

        var normalized = input.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(input.Length);

        foreach (var ch in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
            {
                builder.Append(ch);
            }
        }

        return builder
            .ToString()
            .Normalize(NormalizationForm.FormC)
            .Replace("  ", " ");
    }

    private static bool EmpiezaConMf(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var first = value.Trim().ToUpperInvariant()[0];
        return first == 'M' || first == 'F';
    }

    private static string ObtenerApellidoDeApellidosNombres(string apellidosNombres)
    {
        if (string.IsNullOrWhiteSpace(apellidosNombres))
        {
            return string.Empty;
        }

        var split = apellidosNombres.Split(',', 2);
        return split[0];
    }

    private static string ObtenerNombreDeApellidosNombres(string apellidosNombres)
    {
        if (string.IsNullOrWhiteSpace(apellidosNombres))
        {
            return string.Empty;
        }

        var split = apellidosNombres.Split(',', 2);
        if (split.Length < 2)
        {
            return string.Empty;
        }

        return split[1];
    }

    private static string NormalizarSexo(string value)
    {
        var raw = NormalizarTexto(value);
        if (raw.StartsWith("M"))
        {
            return "M";
        }

        if (raw.StartsWith("F"))
        {
            return "F";
        }

        if (raw.StartsWith("X"))
        {
            return "X";
        }

        return raw;
    }
}
