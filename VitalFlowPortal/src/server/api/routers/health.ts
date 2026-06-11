import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { MockHISAdapter } from "~/server/services/his/mock-adapter";
import { db } from "~/server/db";
import { getSelectores, buscarDisponibilidad, getPatientAppointmentsFromHis, reservarTurno, cancelarTurno } from "~/server/services/his/vitalflow-adapter";

// Instanciamos el adaptador universal (Mock por ahora)
const hisService = new MockHISAdapter();
const DEMO_HIS_PATIENT_ID = process.env.HIS_DEMO_PATIENT_ID ?? "edf33d1d-bf17-41f4-9e40-40c2e21d1eb6";

export const healthRouter = createTRPCRouter({
  // Obtener resumen para el Dashboard
  getDashboardSummary: publicProcedure.query(async () => {
    // En una app real, aquí usaríamos el ID del usuario autenticado
    const patientId = "patient_123";
    
    const [appointments, studies] = await Promise.all([
      hisService.getPatientAppointments(patientId),
      hisService.getPatientStudies(patientId),
    ]);

    return {
      nextAppointment: appointments[0] ?? null,
      recentStudiesCount: studies.length,
      latestStudy: studies[0] ?? null,
      appointmentsCount: appointments.length
    };
  }),

  // Obtener todos los estudios detallados con filtros
  getMedicalHistory: publicProcedure
    .input(z.object({
      type: z.enum(['LAB', 'IMG']).optional(),
      days: z.number().optional()
    }).optional())
    .query(async ({ input }) => {
      const patientId = "patient_123";
      return await hisService.getPatientStudies(patientId, input);
    }),

  // Obtener turnos reservados del paciente: futuros + historial
  getAppointments: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    let hisPatientId = "edf33d1d-bf17-41f4-9e40-40c2e21d1eb6"; // demo default

    try {
      const patient = await db.patient.findUnique({
        where: { userId },
        select: { hisId: true },
      });
      hisPatientId = patient?.hisId ?? hisPatientId;
    } catch (e) {
      console.warn("[health.getAppointments] DB error getting patient:", e);
    }

    try {
      // Traer turnos futuros confirmados
      const futureAppointments = await getPatientAppointmentsFromHis(hisPatientId, {
        historial: false,
        page: 1,
        pageSize: 20,
      });

      // Traer historial de turnos pasados
      const pastAppointments = await getPatientAppointmentsFromHis(hisPatientId, {
        historial: true,
        page: 1,
        pageSize: 20,
      });

      // Retornar estructura con ambas secciones
      return {
        future: futureAppointments,
        past: pastAppointments,
      };
    } catch (e) {
      console.error("[health.getAppointments] Error fetching appointments:", e);
      return { future: [], past: [] };
    }
  }),

  // ── Integración HIS real ────────────────────────────────────────────────

  // Obtener centros, servicios, prácticas y profesionales disponibles
  getSelectores: publicProcedure.query(async () => {
    try {
      return await getSelectores();
    } catch (e) {
      console.error("[health.getSelectores] HIS unavailable:", e);
      return { centros: [], servicios: [], practicas: [], profesionales: [] };
    }
  }),

  // Buscar slots disponibles según filtros (para "Solicitar Nuevo Turno")
  searchAvailableSlots: protectedProcedure
    .input(z.object({
      centroIds: z.array(z.string()).optional(),
      servicioId: z.string().optional(),
      practicaId: z.string().optional(),
      profesionalId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Use default filters if not provided
        const slots = await buscarDisponibilidad({
          pacienteId: ctx.session.user.id,
          financiadorPlanId: "particular",
          centroIds: input.centroIds || ["00000000-0000-0000-0000-000000000001"],
          servicioId: input.servicioId || "00000000-0000-0000-0000-000000000101",
          practicaId: input.practicaId || "prac-00000000-0000-0000-0000-000000000101-consulta-general",
          profesionalId: input.profesionalId,
        });

        // Map to appointment format
        return slots.map((slot, idx) => ({
          id: slot.id || `slot-${idx}`,
          externalId: slot.id,
          start: new Date(`${slot.fecha}T${slot.hora}`),
          end: new Date(`${slot.fecha}T${slot.hora}:30`),
          status: "available" as const,
          professional: {
            id: slot.profesional,
            name: slot.profesional,
            specialty: slot.servicio,
          },
          facility: {
            id: slot.centro,
            name: slot.centro,
          },
          reason: `${slot.servicio} - ${slot.practica}`,
        }));
      } catch (e) {
        console.error("[health.searchAvailableSlots] Error:", e);
        return [];
      }
    }),

  // --- TELEMEDICINA ---
  joinQueue: protectedProcedure
    .input(z.object({ specialty: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userEmail = ctx.session.user.email;
      if (!userEmail) throw new Error("No hay email en la sesión");
      
      console.log("MUTATION: joinQueue para email:", userEmail);

      try {
        // 1. Buscar o crear usuario por EMAIL
        const user = await db.user.upsert({
          where: { email: userEmail },
          update: {},
          create: {
              email: userEmail,
              name: ctx.session.user.name || "Usuario de Test"
          }
        });

        // 2. Vincular paciente
        const patient = await db.patient.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id, onboardingCompleted: true }
        });

        console.log("Paciente vinculado:", patient.id);

        // Cancelar WAITING previos
        await db.telemedicineCall.updateMany({
          where: { patientId: patient.id, status: "WAITING" },
          data: { status: "CANCELLED" },
        });

        // Crear nueva llamada
        return await db.telemedicineCall.create({
          data: {
            patientId: patient.id,
            specialty: input.specialty,
            status: "WAITING",
          },
        });
      } catch (error) {
        console.error("DB Error in joinQueue, using fallback:", error);
        // Fallback para que la demo no se rompa si la DB falla
        return {
          id: `mock-call-${Date.now()}`,
          patientId: "mock-patient",
          specialty: input.specialty,
          status: "WAITING",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }),

  getActiveCall: protectedProcedure.query(async ({ ctx }) => {
    const userEmail = ctx.session?.user?.email;
    if (!userEmail) return null;

    try {
      const user = await db.user.findUnique({
          where: { email: userEmail },
          include: { patient: true }
      });
      
      if (!user?.patient) return null;

      return db.telemedicineCall.findFirst({
        where: { 
          patientId: user.patient.id, 
          status: { in: ["WAITING", "IN_PROGRESS", "COMPLETED"] } 
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error in getActiveCall:", error);
      return null;
    }
  }),

  // Médico: Ver pacientes en espera
  getWaitingQueue: publicProcedure.query(async () => {
    return db.telemedicineCall.findMany({
      where: { status: "WAITING" },
      include: { patient: { include: { user: true } } },
      orderBy: { createdAt: "asc" },
    });
  }),

  // Médico: Ver si tengo una llamada activa para reconectar
  getDoctorActiveCall: publicProcedure
    .input(z.object({ doctorName: z.string() }))
    .query(async ({ input }) => {
      return db.telemedicineCall.findFirst({
        where: { 
            doctorId: input.doctorName, 
            status: "IN_PROGRESS" 
        },
        include: { patient: { include: { user: true } } },
        orderBy: { updatedAt: "desc" },
      });
    }),

  // Médico: Aceptar un paciente
  acceptCall: publicProcedure
    .input(z.object({ callId: z.string(), doctorName: z.string() }))
    .mutation(async ({ input }) => {
      const roomName = `quantum-call-${input.callId.slice(-6)}`;
      return db.telemedicineCall.update({
        where: { id: input.callId },
        data: {
          status: "IN_PROGRESS",
          doctorId: input.doctorName,
          roomName,
          startTime: new Date(),
        },
        include: { patient: { include: { user: true } } },
      });
    }),

  // Finalizar llamada
  endCall: publicProcedure
    .input(z.object({ callId: z.string() }))
    .mutation(async ({ input }) => {
      return db.telemedicineCall.update({
        where: { id: input.callId },
        data: {
          status: "COMPLETED",
          endTime: new Date(),
        },
      });
    }),

  // Guardar encuesta de satisfacción
  submitSurvey: publicProcedure
    .input(z.object({
      callId: z.string(),
      patientId: z.string(),
      attentionRating: z.string(),
      connectionRating: z.string(),
      videoRating: z.string(),
      audioRating: z.string(),
      comment: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.telemedicineSurvey.create({
        data: {
          callId: input.callId,
          patientId: input.patientId,
          attentionRating: input.attentionRating,
          connectionRating: input.connectionRating,
          videoRating: input.videoRating,
          audioRating: input.audioRating,
          comment: input.comment,
        }
      });
    }),

  // Reservar turno en el HIS
  reservarTurno: protectedProcedure
    .input(z.object({
      slotId: z.string().describe("ID del slot/turno disponible"),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(`[health.reservarTurno] User ${ctx.session.user.id} reserving slot ${input.slotId}`);
        
        // Get patient HIS ID
        let hisPatientId = "edf33d1d-bf17-41f4-9e40-40c2e21d1eb6"; // demo default
        try {
          const patient = await db.patient.findUnique({
            where: { userId: ctx.session.user.id },
            select: { hisId: true },
          });
          if (patient?.hisId) {
            hisPatientId = patient.hisId;
          }
        } catch (e) {
          console.warn("[health.reservarTurno] DB error getting patient, using demo HIS ID:", e);
        }

        // Call HIS to reserve the slot
        const result = await reservarTurno(input.slotId, hisPatientId);
        
        console.log(`[health.reservarTurno] Reservation result:`, result);
        
        return {
          success: result.success,
          appointmentId: result.id || result.externalId,
          message: result.success ? "Turno reservado exitosamente" : "Error al reservar el turno",
        };
      } catch (e) {
        console.error("[health.reservarTurno] Error:", e);
        throw new Error(`Failed to reserve appointment: ${String(e)}`);
      }
    }),

  cancelarTurno: protectedProcedure
    .input(z.object({
      turnoId: z.string(),
      motivo: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      console.log(`[health.cancelarTurno] User ${ctx.session.user.id} cancelling turno ${input.turnoId}`);
      try {
        const result = await cancelarTurno(input.turnoId, input.motivo);
        return { success: true, estado: result.estado };
      } catch (e) {
        console.error("[health.cancelarTurno] Error:", e);
        throw new Error(`No se pudo cancelar el turno: ${String(e)}`);
      }
    }),
});
