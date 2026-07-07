import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  getRecetasPaciente,
  getRecetaDetalle,
  enviarRecetasEmail,
} from "~/server/services/his/vitalflow-adapter";

async function getHisPatientIdForUser(userId: string): Promise<string> {
  const patient = await db.patient.findUnique({
    where: { userId },
    select: { hisId: true },
  });

  if (!patient?.hisId) {
    throw new Error("Paciente sin vinculacion HIS. Complete onboarding y mapeo hisId.");
  }

  return patient.hisId;
}

export const prescriptionsRouter = createTRPCRouter({
  getPrescriptions: protectedProcedure.query(async ({ ctx }) => {
    const hisPatientId = await getHisPatientIdForUser(ctx.session.user.id);
    return getRecetasPaciente(hisPatientId);
  }),

  getPrescriptionDetail: protectedProcedure
    .input(z.object({ recetaId: z.string() }))
    .query(async ({ input }) => {
      return getRecetaDetalle(input.recetaId);
    }),

  sendEmail: protectedProcedure
    .input(z.object({
      recetaIds: z.array(z.string()).min(1),
      email: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      const hisPatientId = await getHisPatientIdForUser(ctx.session.user.id);
      return enviarRecetasEmail({
        pacienteId: hisPatientId,
        email: input.email,
        recetaIds: input.recetaIds,
      });
    }),
});
