import { PrismaClient, Role, Gender, AnimalStatus, ReportStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  const hashedPassword = await bcrypt.hash("07L5s![UqI!3", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@teste.com.br" },
    update: {},
    create: {
      email: "admin@teste.com.br",
      name: "Administrador",
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const breeds = await prisma.breed.createMany({
    data: [
      { name: "Vira-lata" },
      { name: "Labrador" },
      { name: "Persa" },
      { name: "Siamês" },
    ],
  });

  const breed = await prisma.breed.findFirst({ where: { name: "Vira-lata" } });

  await prisma.animal.createMany({
    data: [
      {
        name: "Mel",
        species: "Cachorro",
        breedId: breed!.id,
        gender: Gender.FEMALE,
        imageUrl: "https://example.com/mel.jpg",
        status: AnimalStatus.ADOPTABLE,
      },
      {
        name: "Tigrinho",
        species: "Gato",
        breedId: breed!.id,
        gender: Gender.MALE,
        imageUrl: "https://example.com/tigrinho.jpg",
        status: AnimalStatus.TREATMENT,
      },
    ],
  });

  await prisma.event.create({
    data: {
      title: "Feira de Adoção",
      description: "Evento para adoção de animais resgatados.",
      tags: ["adoção", "animais", "evento"],
      finishAt: new Date("2025-12-10"),
    },
  });

  await prisma.campaign.create({
    data: {
      title: "Ajude a castrar 50 animais",
      description: "Campanha para arrecadação de fundos para castração.",
      targetAmount: 5000.00,
      finishAt: new Date("2025-12-31"),
    },
  });

  await prisma.report.create({
    data: {
      title: "Animal abandonado na rua",
      description: "Cachorro preso em corrente sem água.",
      address: "Rua das Flores, 123",
      tags: ["abandono", "cachorro", "urgente"],
      status: ReportStatus.AWAITING,
    },
  });

  await prisma.person.create({
    data: {
      name: "Joana Silva",
      cpf: "12345678900",
      birthDate: new Date("1990-05-15"),
      gender: Gender.FEMALE,
    },
  });

  console.log("✅ Dados de exemplo criados com sucesso!");
  console.log("📋 Usuário administrador:");
  console.log("┌────────────────────────────────────────────────────────────────────────────┐");
  console.log("│ Email                              │ Senha        │ Nome                   │");
  console.log("├────────────────────────────────────────────────────────────────────────────┤");
  console.log("│ admin@teste.com.br                 │ 07L5s![UqI!3 │ Administrador          │");
  console.log("└────────────────────────────────────────────────────────────────────────────┘");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
