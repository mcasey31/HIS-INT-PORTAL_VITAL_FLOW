using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text.Json.Serialization;
using VitalFlow.His.Api.Application.Agenda.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("fhir")]
[Authorize(Roles = "Administrador,Administrativo,Cajero,Auditor")]
public sealed class FhirController(IAgendaService agendaService) : ControllerBase
{
    [HttpGet("R4/Schedule")]
    public IActionResult GetSchedulesR4(
        [FromQuery(Name = "actor")] string? actor,
        [FromQuery(Name = "service-type")] string? serviceType,
        [FromQuery(Name = "location")] string? location,
        [FromQuery(Name = "active")] bool? active,
        [FromQuery(Name = "_count")] int? count,
        [FromQuery(Name = "_page")] int? page)
    {
        var effectiveActive = active ?? true;
        var effectiveCount = Math.Clamp(count ?? 20, 1, 100);
        var effectivePage = Math.Max(page ?? 1, 1);

        var schedules = agendaService.GetAgendas(null, effectiveActive).AsEnumerable();

        if (TryParseReferenceId(actor, out var actorId))
        {
            schedules = schedules.Where(s => s.EfectorId == actorId);
        }

        if (TryParseReferenceId(location, out var locationId))
        {
            schedules = schedules.Where(s => s.CentroId == locationId);
        }

        if (!string.IsNullOrWhiteSpace(serviceType))
        {
            var serviceTypeFilter = serviceType.Trim();
            if (Guid.TryParse(ExtractReferenceValue(serviceTypeFilter), out var serviceTypeId))
            {
                schedules = schedules.Where(s => s.ServicioId == serviceTypeId);
            }
            else
            {
                schedules = schedules.Where(s =>
                    s.Servicio.Contains(serviceTypeFilter, StringComparison.OrdinalIgnoreCase));
            }
        }

        var query = HttpContext.Request.Query;
        var dateFilters = query.TryGetValue("date", out var dateValues)
            ? dateValues!.Select(v => v ?? string.Empty).ToArray()
            : Array.Empty<string>();
        if (dateFilters.Length > 0)
        {
            schedules = schedules.Where(s => MatchesDateFilters(s.FechaDesde, s.FechaHasta, dateFilters));
        }

        var filtered = schedules.ToList();
        var total = filtered.Count;
        var offset = (effectivePage - 1) * effectiveCount;
        var paged = filtered.Skip(offset).Take(effectiveCount).ToList();

        var baseUrl = $"{Request.Path}{Request.QueryString}";
        var entries = paged.Select(s => new
        {
            fullUrl = $"/fhir/R4/Schedule/{s.Id}",
            resource = new
            {
                resourceType = "Schedule",
                id = s.Id,
                identifier = new[]
                {
                    new { system = "https://his.vitalflow.com.ar/identifier/agenda", value = s.Codigo }
                },
                active = s.Activa,
                serviceType = new[]
                {
                    new
                    {
                        text = s.Servicio
                    }
                },
                actor = new[]
                {
                    new { reference = $"PractitionerRole/{s.EfectorId}", display = s.Efector },
                    new { reference = $"Location/{s.CentroId}", display = s.Centro }
                },
                planningHorizon = new
                {
                    start = ToFhirDateTime(s.FechaDesde, TimeOnly.MinValue),
                    end = ToFhirDateTime(s.FechaHasta ?? s.FechaDesde, new TimeOnly(23, 59, 59))
                },
                comment = s.Nombre,
                extension = new[]
                {
                    new
                    {
                        url = "https://his.vitalflow.com.ar/extension/tipoAgenda",
                        valueString = (string?)s.TipoAgenda,
                        valueBoolean = (bool?)null
                    },
                    new
                    {
                        url = "https://his.vitalflow.com.ar/extension/visibleContactCenter",
                        valueString = (string?)null,
                        valueBoolean = (bool?)s.VisibleContactCenter
                    }
                }
            }
        });

        return Ok(new
        {
            resourceType = "Bundle",
            type = "searchset",
            total,
            link = new[]
            {
                new { relation = "self", url = baseUrl }
            },
            entry = entries
        });
    }

    [HttpGet("R4/Slot")]
    public IActionResult GetSlotsR4(
        [FromQuery(Name = "schedule")] string? schedule,
        [FromQuery(Name = "status")] string? status,
        [FromQuery(Name = "_count")] int? count,
        [FromQuery(Name = "_page")] int? page)
    {
        if (!TryParseReferenceId(schedule, out var scheduleId))
        {
            return BadRequest(new { message = "schedule es obligatorio y debe ser Schedule/{id} o GUID." });
        }

        var effectiveCount = Math.Clamp(count ?? 20, 1, 100);
        var effectivePage = Math.Max(page ?? 1, 1);

        var query = HttpContext.Request.Query;
        var startFilters = query.TryGetValue("start", out var startValues)
            ? startValues!.Select(v => v ?? string.Empty)
            : Array.Empty<string>();
        var (startFrom, startTo) = ParseDateTimeRangeFilters(startFilters);

        var result = agendaService.SearchFhirSlots(scheduleId, status, startFrom, startTo, effectiveCount, effectivePage);

        var baseUrl = $"{Request.Path}{Request.QueryString}";
        var entries = result.Slots.Select(slot => new
        {
            fullUrl = $"/fhir/R4/Slot/{slot.Id}",
            resource = new
            {
                resourceType = "Slot",
                id = slot.Id,
                identifier = new[]
                {
                    new { system = "https://his.vitalflow.com.ar/identifier/slot", value = $"SLOT-{slot.Id}" }
                },
                schedule = new
                {
                    reference = $"Schedule/{slot.ScheduleId}",
                    display = slot.ScheduleName
                },
                status = slot.Status,
                start = slot.Start.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture),
                end = slot.End.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture),
                overbooked = slot.Overbooked,
                extension = new[]
                {
                    new
                    {
                        url = "https://his.vitalflow.com.ar/extension/capacity",
                        valueInteger = (int?)slot.Capacity,
                        valueReference = (object?)null
                    },
                    new
                    {
                        url = "https://his.vitalflow.com.ar/extension/location",
                        valueInteger = (int?)null,
                        valueReference = (object?)(slot.LocationId is null
                            ? null
                            : new { reference = $"Location/{slot.LocationId}", display = slot.LocationName })
                    }
                }
            }
        });

        return Ok(new
        {
            resourceType = "Bundle",
            type = "searchset",
            total = result.Total,
            link = new[]
            {
                new { relation = "self", url = baseUrl }
            },
            entry = entries
        });
    }

    [HttpPost("R4/Appointment")]
    public IActionResult CreateAppointmentR4(
        [FromBody] FhirAppointmentCreateBody body,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
        [FromHeader(Name = "Correlation-Id")] string? correlationId)
    {
        if (body is null)
        {
            return UnprocessableEntity(OperationOutcome("invalid", "Body FHIR Appointment es obligatorio."));
        }

        if (!string.Equals(body.ResourceType, "Appointment", StringComparison.OrdinalIgnoreCase))
        {
            return UnprocessableEntity(OperationOutcome("invalid", "resourceType debe ser Appointment."));
        }

        if (string.IsNullOrWhiteSpace(idempotencyKey))
        {
            return BadRequest(OperationOutcome("required", "Header Idempotency-Key es obligatorio."));
        }

        if (string.IsNullOrWhiteSpace(correlationId))
        {
            return BadRequest(OperationOutcome("required", "Header Correlation-Id es obligatorio."));
        }

        var slotReference = body.Slot?.FirstOrDefault()?.Reference;
        if (!TryParseReferenceId(slotReference, out var slotId))
        {
            return UnprocessableEntity(OperationOutcome("invalid", "slot[0].reference debe ser Slot/{id} o GUID."));
        }

        var patientReference = body.Participant?
            .FirstOrDefault(p => string.Equals(p.Actor?.ReferenceType, "Patient", StringComparison.OrdinalIgnoreCase))?
            .Actor?.Reference;

        var patientId = ExtractReferenceValue(patientReference ?? string.Empty);
        if (string.IsNullOrWhiteSpace(patientId))
        {
            return UnprocessableEntity(OperationOutcome("required", "participant.actor.reference de Patient es obligatorio."));
        }

        var serviceResult = agendaService.CreateFhirAppointment(new Application.Agenda.Contracts.FhirAppointmentCreateRequest(
            patientId,
            slotId,
            body.Start,
            body.End,
            body.ReasonCode?.FirstOrDefault()?.Text,
            body.Identifier?.FirstOrDefault()?.Value,
            idempotencyKey.Trim(),
            correlationId.Trim()
        ));

        if (serviceResult.Appointment is null)
        {
            return serviceResult.Outcome switch
            {
                "slot-not-found" => NotFound(OperationOutcome("not-found", serviceResult.Diagnostics ?? "Slot inexistente.")),
                "slot-unavailable" => Conflict(OperationOutcome("conflict", serviceResult.Diagnostics ?? "Slot no disponible.")),
                _ => UnprocessableEntity(OperationOutcome("invalid", serviceResult.Diagnostics ?? "Solicitud invalida."))
            };
        }

        var appointment = serviceResult.Appointment;
        var resource = new
        {
            resourceType = "Appointment",
            id = appointment.AppointmentId,
            status = appointment.Status,
            identifier = new[]
            {
                new { system = "https://his.vitalflow.com.ar/identifier/appointment", value = appointment.AppointmentId },
                string.IsNullOrWhiteSpace(appointment.ExternalIdentifier)
                    ? null
                    : new { system = "urn:portal:appointment-external", value = appointment.ExternalIdentifier }
            }.Where(i => i is not null),
            slot = new[]
            {
                new { reference = $"Slot/{appointment.SlotId}" }
            },
            start = appointment.Start.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture),
            end = appointment.End.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture),
            participant = new object[]
            {
                new
                {
                    actor = new
                    {
                        reference = $"Patient/{appointment.PatientId}"
                    },
                    status = "accepted"
                },
                new
                {
                    actor = new
                    {
                        reference = $"PractitionerRole/{appointment.EfectorId}"
                    },
                    status = "accepted"
                },
                new
                {
                    actor = new
                    {
                        reference = $"Location/{appointment.CentroId}"
                    },
                    status = "accepted"
                }
            },
            reasonCode = string.IsNullOrWhiteSpace(appointment.Reason)
                ? null
                : new[] { new { text = appointment.Reason } }
        };

        if (serviceResult.Outcome == "idempotent-replay")
        {
            return Ok(resource);
        }

        return Created($"/fhir/R4/Appointment/{appointment.AppointmentId}", resource);
    }

    [HttpGet("R4/Appointment")]
    public IActionResult GetAppointmentsR4(
        [FromQuery(Name = "patient")] string? patient,
        [FromQuery(Name = "status")] string? status,
        [FromQuery(Name = "_count")] int? count,
        [FromQuery(Name = "_page")] int? page)
    {
        var effectiveCount = Math.Clamp(count ?? 20, 1, 100);
        var effectivePage = Math.Max(page ?? 1, 1);

        var query = HttpContext.Request.Query;
        var dateFilters = query.TryGetValue("date", out var dateValues)
            ? dateValues!.Select(v => v ?? string.Empty)
            : Array.Empty<string>();
        var (dateFrom, dateTo) = ParseDateTimeRangeFilters(dateFilters);

        var patientId = TryParseReferenceId(patient, out var patientGuid)
            ? patientGuid.ToString()
            : ExtractReferenceValue(patient ?? string.Empty);

        var result = agendaService.SearchFhirAppointments(
            string.IsNullOrWhiteSpace(patientId) ? null : patientId,
            status,
            dateFrom,
            dateTo,
            effectiveCount,
            effectivePage);

        var baseUrl = $"{Request.Path}{Request.QueryString}";
        var entries = result.Appointments.Select(appointment => new
        {
            fullUrl = $"/fhir/R4/Appointment/{appointment.AppointmentId}",
            resource = new
            {
                resourceType = "Appointment",
                id = appointment.AppointmentId,
                status = appointment.Status,
                identifier = new[]
                {
                    new { system = "https://his.vitalflow.com.ar/identifier/appointment", value = appointment.AppointmentId }
                },
                slot = new[]
                {
                    new { reference = $"Slot/{appointment.SlotId}" }
                },
                start = appointment.Start.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture),
                end = appointment.End.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture),
                participant = new object[]
                {
                    new
                    {
                        actor = new
                        {
                            reference = $"Patient/{appointment.PatientId}"
                        },
                        status = "accepted"
                    },
                    new
                    {
                        actor = new
                        {
                            reference = $"PractitionerRole/{appointment.EfectorId}"
                        },
                        status = "accepted"
                    },
                    new
                    {
                        actor = new
                        {
                            reference = $"Location/{appointment.CentroId}"
                        },
                        status = "accepted"
                    }
                },
                reasonCode = string.IsNullOrWhiteSpace(appointment.Reason)
                    ? null
                    : new[] { new { text = appointment.Reason } }
            }
        });

        return Ok(new
        {
            resourceType = "Bundle",
            type = "searchset",
            total = result.Total,
            link = new[]
            {
                new { relation = "self", url = baseUrl }
            },
            entry = entries
        });
    }

    [HttpGet("R4/Location")]
    public IActionResult GetLocationsR4(
        [FromQuery(Name = "name")] string? name,
        [FromQuery(Name = "active")] bool? active,
        [FromQuery(Name = "_count")] int? count,
        [FromQuery(Name = "_page")] int? page)
    {
        var effectiveCount = Math.Clamp(count ?? 20, 1, 100);
        var effectivePage = Math.Max(page ?? 1, 1);

        var result = agendaService.SearchFhirLocations(name, active, effectiveCount, effectivePage);
        var baseUrl = $"{Request.Path}{Request.QueryString}";

        var entries = result.Locations.Select(location => new
        {
            fullUrl = $"/fhir/R4/Location/{location.Id}",
            resource = new
            {
                resourceType = "Location",
                id = location.Id,
                identifier = new[]
                {
                    new { system = "https://his.vitalflow.com.ar/identifier/location", value = $"LOC-{location.Id}" }
                },
                name = location.Name,
                status = location.Active ? "active" : "inactive"
            }
        });

        return Ok(new
        {
            resourceType = "Bundle",
            type = "searchset",
            total = result.Total,
            link = new[]
            {
                new { relation = "self", url = baseUrl }
            },
            entry = entries
        });
    }

    [HttpGet("R4/Appointment/{id}")]
    public IActionResult GetAppointmentByIdR4(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest(OperationOutcome("required", "id es obligatorio."));
        }

        var appointment = agendaService.GetFhirAppointmentById(id);
        if (appointment is null)
        {
            return NotFound(OperationOutcome("not-found", "Appointment no encontrado."));
        }

        return Ok(new
        {
            resourceType = "Appointment",
            id = appointment.AppointmentId,
            status = appointment.Status,
            identifier = new[]
            {
                new { system = "https://his.vitalflow.com.ar/identifier/appointment", value = appointment.AppointmentId }
            },
            slot = new[]
            {
                new { reference = $"Slot/{appointment.SlotId}" }
            },
            start = appointment.Start.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture),
            end = appointment.End.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture),
            participant = new object[]
            {
                new
                {
                    actor = new
                    {
                        reference = $"Patient/{appointment.PatientId}"
                    },
                    status = "accepted"
                },
                new
                {
                    actor = new
                    {
                        reference = $"PractitionerRole/{appointment.EfectorId}"
                    },
                    status = "accepted"
                },
                new
                {
                    actor = new
                    {
                        reference = $"Location/{appointment.CentroId}"
                    },
                    status = "accepted"
                }
            },
            reasonCode = string.IsNullOrWhiteSpace(appointment.Reason)
                ? null
                : new[] { new { text = appointment.Reason } }
        });
    }

    [HttpGet("Schedule")]
    public IActionResult GetSchedules()
    {
        var entries = agendaService.GetAgendas(null, null).Select(a => new
        {
            resourceType = "Schedule",
            id = a.Id,
            active = a.Activa,
            planningHorizon = new
            {
                start = a.FechaDesde.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc),
                end = a.FechaHasta?.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc)
            },
            identifier = new[]
            {
                new { system = "https://vitalflow.his/agenda", value = a.Codigo }
            }
        });

        return Ok(new { resourceType = "Bundle", type = "searchset", total = entries.Count(), entry = entries.Select(e => new { resource = e }) });
    }

    [HttpGet("Schedule/{id:guid}")]
    public IActionResult GetScheduleById(Guid id)
    {
        var schedule = agendaService.GetAgendas(null, null).FirstOrDefault(a => a.Id == id);
        if (schedule is null)
        {
            return NotFound();
        }

        return Ok(new
        {
            resourceType = "Schedule",
            id = schedule.Id,
            active = schedule.Activa,
            identifier = new[] { new { system = "https://vitalflow.his/agenda", value = schedule.Codigo } },
            planningHorizon = new
            {
                start = schedule.FechaDesde.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc),
                end = schedule.FechaHasta?.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc)
            }
        });
    }

    [HttpGet("Slot")]
    public IActionResult GetSlots([FromQuery] Guid schedule)
    {
        var disponibilidad = agendaService.GetDisponibilidad(schedule);
        if (disponibilidad is null)
        {
            return NotFound();
        }

        return Ok(new
        {
            resourceType = "Bundle",
            type = "searchset",
            total = 1,
            entry = new[]
            {
                new
                {
                    resource = new
                    {
                        resourceType = "Slot",
                        id = Guid.NewGuid(),
                        schedule = new { reference = $"Schedule/{schedule}" },
                        status = disponibilidad.CuposDisponibles > 0 ? "free" : "busy-unavailable",
                        comment = $"Totales: {disponibilidad.CuposTotales}, disponibles: {disponibilidad.CuposDisponibles}"
                    }
                }
            }
        });
    }

    private static bool TryParseReferenceId(string? reference, out Guid id)
    {
        id = Guid.Empty;
        if (string.IsNullOrWhiteSpace(reference))
        {
            return false;
        }

        return Guid.TryParse(ExtractReferenceValue(reference), out id);
    }

    private static string ExtractReferenceValue(string value)
    {
        var trimmed = value.Trim();
        var slashIndex = trimmed.LastIndexOf('/');
        return slashIndex >= 0 ? trimmed[(slashIndex + 1)..] : trimmed;
    }

    private static bool MatchesDateFilters(DateOnly start, DateOnly? end, IReadOnlyList<string> filters)
    {
        var scheduleStart = start;
        var scheduleEnd = end ?? start;

        foreach (var raw in filters)
        {
            if (!TryParseDateFilter(raw, out var op, out var date))
            {
                continue;
            }

            var passes = op switch
            {
                "ge" => scheduleEnd >= date,
                "gt" => scheduleEnd > date,
                "le" => scheduleStart <= date,
                "lt" => scheduleStart < date,
                "eq" => scheduleStart <= date && scheduleEnd >= date,
                _ => scheduleStart <= date && scheduleEnd >= date
            };

            if (!passes)
            {
                return false;
            }
        }

        return true;
    }

    private static bool TryParseDateFilter(string? raw, out string op, out DateOnly date)
    {
        op = "eq";
        date = default;
        if (string.IsNullOrWhiteSpace(raw))
        {
            return false;
        }

        var trimmed = raw.Trim();
        if (trimmed.Length >= 2)
        {
            var candidateOp = trimmed[..2].ToLowerInvariant();
            if (candidateOp is "ge" or "gt" or "le" or "lt" or "eq")
            {
                op = candidateOp;
                trimmed = trimmed[2..];
            }
        }

        return DateOnly.TryParseExact(trimmed, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date);
    }

    private static (DateTimeOffset? From, DateTimeOffset? To) ParseDateTimeRangeFilters(IEnumerable<string> rawFilters)
    {
        DateTimeOffset? from = null;
        DateTimeOffset? to = null;

        foreach (var raw in rawFilters)
        {
            if (!TryParseDateTimeFilter(raw, out var op, out var value))
            {
                continue;
            }

            if (op is "ge" or "gt")
            {
                from = !from.HasValue || value > from.Value ? value : from;
            }

            if (op is "le" or "lt")
            {
                to = !to.HasValue || value < to.Value ? value : to;
            }
        }

        return (from, to);
    }

    private static bool TryParseDateTimeFilter(string? raw, out string op, out DateTimeOffset value)
    {
        op = "eq";
        value = default;
        if (string.IsNullOrWhiteSpace(raw))
        {
            return false;
        }

        var trimmed = raw.Trim();
        if (trimmed.Length >= 2)
        {
            var candidateOp = trimmed[..2].ToLowerInvariant();
            if (candidateOp is "ge" or "gt" or "le" or "lt" or "eq")
            {
                op = candidateOp;
                trimmed = trimmed[2..];
            }
        }

        return DateTimeOffset.TryParse(trimmed, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out value);
    }

    private static string ToFhirDateTime(DateOnly date, TimeOnly time)
    {
        var dateTime = date.ToDateTime(time, DateTimeKind.Unspecified);
        var offset = new DateTimeOffset(dateTime, TimeSpan.FromHours(-3));
        return offset.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture);
    }

    private static object OperationOutcome(string code, string diagnostics)
    {
        return new
        {
            resourceType = "OperationOutcome",
            issue = new[]
            {
                new
                {
                    severity = "error",
                    code,
                    diagnostics
                }
            }
        };
    }

    public sealed record FhirAppointmentCreateBody(
        [property: JsonPropertyName("resourceType")] string? ResourceType,
        [property: JsonPropertyName("identifier")] IReadOnlyList<FhirIdentifier>? Identifier,
        [property: JsonPropertyName("slot")] IReadOnlyList<FhirReference>? Slot,
        [property: JsonPropertyName("participant")] IReadOnlyList<FhirParticipant>? Participant,
        [property: JsonPropertyName("start")] DateTimeOffset? Start,
        [property: JsonPropertyName("end")] DateTimeOffset? End,
        [property: JsonPropertyName("reasonCode")] IReadOnlyList<FhirCodeableConcept>? ReasonCode
    );

    public sealed record FhirIdentifier(
        [property: JsonPropertyName("system")] string? System,
        [property: JsonPropertyName("value")] string? Value
    );

    public sealed record FhirReference(
        [property: JsonPropertyName("reference")] string? Reference,
        [property: JsonPropertyName("display")] string? Display
    )
    {
        [JsonIgnore]
        public string? ReferenceType
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Reference))
                {
                    return null;
                }

                var parts = Reference.Split('/', 2, StringSplitOptions.RemoveEmptyEntries);
                return parts.Length == 2 ? parts[0] : null;
            }
        }
    }

    public sealed record FhirParticipant(
        [property: JsonPropertyName("actor")] FhirReference? Actor,
        [property: JsonPropertyName("status")] string? Status
    );

    public sealed record FhirCodeableConcept(
        [property: JsonPropertyName("text")] string? Text
    );
}
