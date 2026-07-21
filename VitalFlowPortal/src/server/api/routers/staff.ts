import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const staffRouter = createTRPCRouter({
  // Listar todo el staff médico
  list: publicProcedure.query(async () => {
    return await db.user.findMany({
      where: { role: "DOCTOR" },
      include: { professional: true },
      orderBy: { name: "asc" }
    });
  }),

  // Alta de nuevo profesional (Manual desde Admin)
  create: publicProcedure
    .input(z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      licenseNumber: z.string().min(3),
      specialty: z.string(),
      phone: z.string().optional(),
      address: z.string().optional(),
      username: z.string().min(3),
      password: z.string().min(4),
      institutionId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const institutionId = input.institutionId ?? (ctx.session?.user as any)?.institutionId;

      const user = await ctx.db.user.create({
        data: {
          name: `${input.firstName} ${input.lastName}`,
          username: input.username,
          password: input.password,
          role: "DOCTOR",
          institutionId,
        }
      });

      return await ctx.db.professional.create({
        data: {
          userId: user.id,
          licenseNumber: input.licenseNumber,
          specialty: input.specialty,
          phoneNumber: input.phone,
          address: input.address,
        }
      });
    }),

  // Eliminar profesional
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db.user.delete({
        where: { id: input.id }
      });
    }),
});
