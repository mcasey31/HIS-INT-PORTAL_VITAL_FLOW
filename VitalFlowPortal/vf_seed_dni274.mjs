import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const dni = "27483779";
const hisId = "8376a007-e9e6-455c-818e-a4cc41f46db1";
const email = `dni-${dni}@pacientes.local`;

try {
  const user = await db.user.upsert({
    where: { email },
    update: {
      name: `Paciente ${dni}`,
      role: "PATIENT",
      username: `paciente-${dni}`,
      password: "1234",
    },
    create: {
      email,
      name: `Paciente ${dni}`,
      role: "PATIENT",
      username: `paciente-${dni}`,
      password: "1234",
    },
  });

  const existing = await db.patient.findUnique({ where: { userId: user.id } });

  const patient = existing
    ? await db.patient.update({
        where: { userId: user.id },
        data: { dni, hisId, onboardingCompleted: true },
      })
    : await db.patient.create({
        data: { userId: user.id, dni, hisId, onboardingCompleted: true },
      });

  console.log(JSON.stringify({ user: { id: user.id, email: user.email }, patient: { id: patient.id, dni: patient.dni, hisId: patient.hisId } }, null, 2));
} finally {
  await db.$disconnect();
}
