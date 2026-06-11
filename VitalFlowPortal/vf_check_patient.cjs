const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  const rows = await db.patient.findMany({
    where: {
      OR: [
        { dni: "27483779" },
        { user: { email: "dni-27483779@pacientes.local" } }
      ]
    },
    include: {
      user: { select: { id: true, email: true, name: true } }
    }
  });

  console.log(JSON.stringify(rows, null, 2));
  await db.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
