import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("tacoclip-admin", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      name: "Administrador",
      password,
    },
  });

  const client = await prisma.client.upsert({
    where: { id: "client-taco" },
    update: {
      name: "TACO Comunicacao",
      active: true,
    },
    create: {
      id: "client-taco",
      name: "TACO Comunicacao",
      segment: "Assessoria de imprensa",
      ownerName: "TACO",
      active: true,
    },
  });

  await prisma.monitoringTerm.upsert({
    where: { id: "term-taco-comunicacao" },
    update: { term: "TACO Comunicacao", active: true },
    create: {
      id: "term-taco-comunicacao",
      clientId: client.id,
      term: "TACO Comunicacao",
      active: true,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
