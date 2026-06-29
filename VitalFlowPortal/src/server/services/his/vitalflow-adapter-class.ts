import type { IHISAdapter } from "./adapter.interface";
import type { UniversalAppointment, UniversalMedicalStudy, UniversalProfessional } from "./universal-types";
import { getPatientAppointmentsFromHis, getSelectores, buscarDisponibilidad, getHisPatientIdByDni } from "./vitalflow-adapter";
import { HISApiError } from "./his-error";

export class VitalFlowHISAdapter implements IHISAdapter {
  async getPatientAppointments(patientHisId: string): Promise<UniversalAppointment[]> {
    try {
      return getPatientAppointmentsFromHis(patientHisId, { historial: false });
    } catch (e) {
      throw wrapError(e);
    }
  }

  async getPatientStudies(_patientHisId: string, _filters?: { type?: "LAB" | "IMG"; days?: number }): Promise<UniversalMedicalStudy[]> {
    return [];
  }

  async getAvailableSlots(specialtyId: string, doctorId?: string): Promise<UniversalAppointment[]> {
    try {
      const selectores = await getSelectores();
      const servicio = selectores.servicios.find(s => s.id === specialtyId);
      if (!servicio) return [];

      const slots = await buscarDisponibilidad({
        pacienteId: "",
        financiadorPlanId: "particular",
        centroIds: servicio.centroIds,
        servicioId: specialtyId,
        practicaId: "",
        profesionalId: doctorId,
      });

      return slots.map((slot, idx) => ({
        id: slot.id || `slot-${idx}`,
        externalId: slot.id,
        start: new Date(`${slot.fecha}T${slot.hora}`),
        end: new Date(`${slot.fecha}T${slot.hora}:30`),
        status: "confirmed" as const,
        professional: { id: slot.profesional, name: slot.profesional, specialty: slot.servicio },
        facility: { id: slot.centro, name: slot.centro },
      }));
    } catch (e) {
      throw wrapError(e);
    }
  }

  async checkInPatient(_appointmentId: string): Promise<boolean> {
    return false;
  }

  async getProfessionals(_specialty?: string): Promise<UniversalProfessional[]> {
    return [];
  }
}

function wrapError(e: unknown): never {
  if (e instanceof HISApiError) throw e;
  if (e instanceof Error) {
    const statusCode = (e as any).status ?? (e as any).statusCode ?? 500;
    throw new HISApiError(statusCode, e.message);
  }
  throw new HISApiError(500, String(e));
}
