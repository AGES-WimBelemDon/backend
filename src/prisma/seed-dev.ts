import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const address1 = await prisma.address.create({
    data: {
      cep: "91040-001",
      street: "Rua dos Jacarandás",
      number: "120",
      neighborhood: "Sarandi",
      city: "Porto Alegre",
      state: "RS",
    },
  });

  const address2 = await prisma.address.create({
    data: {
      cep: "88058-300",
      street: "Rua das Palmeiras",
      number: "45",
      neighborhood: "Ingleses",
      city: "Florianópolis",
      state: "SC",
    },
  });

  const familyAddress = await prisma.address.create({
    data: {
      cep: "91751-200",
      street: "Av. João Antônio Silveira",
      number: "890",
      neighborhood: "Cavalhada",
      city: "Porto Alegre",
      state: "RS",
    },
  });

  await prisma.activity.createMany({
    data: [{ name: "TÊNIS" }, { name: "INFORMÁTICA" }],
  });

  await prisma.level.createMany({
    data: [
      { name: "INICIANTE" },
      { name: "INTERMEDIARIO" },
      { name: "AVANCADO" },
    ],
  });

  const tenisClass = await prisma.class.create({
    data: {
      name: "TÊNIS - Iniciante",
      activityId: 1,
      levelId: 1,
      state: "ATIVA",
      startDate: new Date("2025-02-01"),
      endDate: null,
      startTime: new Date("2025-02-01T14:00:00"),
      endTime: new Date("2025-02-01T15:00:00"),
      isRecurrent: true,
    },
  });

  const informaticaClass = await prisma.class.create({
    data: {
      name: "Informática - Intermediário",
      activityId: 2,
      levelId: 2,
      state: "ATIVA",
      startDate: new Date("2025-02-02"),
      endDate: null,
      startTime: new Date("2025-02-02T16:00:00"),
      endTime: new Date("2025-02-02T17:00:00"),
      isRecurrent: true,
    },
  });

  await prisma.classSchedule.createMany({
    data: [
      { classId: tenisClass.id, dayOfWeek: "TERCA" },
      { classId: informaticaClass.id, dayOfWeek: "QUINTA" },
    ],
  });

  const student1 = await prisma.student.create({
    data: {
      fullName: "Pedro Geromel",
      registrationNumber: "37747324006",
      dateOfBirth: new Date("2012-05-10"),
      addressId: address1.id,
      levelId: 1,
      gender: "MASCULINO",
      schoolName: "EEB Dom João Becker",
      schoolYear: "FUNDAMENTAL_6",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      fullName: "Virginia Fonseca",
      registrationNumber: "22170931007",
      dateOfBirth: new Date("2011-09-21"),
      addressId: address2.id,
      levelId: 1,
      gender: "FEMININO",
      schoolName: "EEB José Sarmento",
      schoolYear: "FUNDAMENTAL_7",
    },
  });

  const student3 = await prisma.student.create({
    data: {
      fullName: "Carlinhos Bala",
      registrationNumber: "11697725015",
      dateOfBirth: new Date("2010-01-15"),
      addressId: address1.id,
      levelId: 2,
      gender: "MASCULINO",
      schoolName: "Colégio Machado de Assis",
      schoolYear: "FUNDAMENTAL_8",
    },
  });

  const student4 = await prisma.student.create({
    data: {
      fullName: "Mel Maia",
      registrationNumber: "15416082089",
      dateOfBirth: new Date("2013-03-12"),
      addressId: address2.id,
      levelId: 2,
      gender: "FEMININO",
      schoolName: "Escola Padre Anchieta",
      schoolYear: "FUNDAMENTAL_5",
    },
  });

  await prisma.enrollment.createMany({
    data: [
      {
        studentId: student1.id,
        classId: tenisClass.id,
      },
      {
        studentId: student2.id,
        classId: tenisClass.id,
      },
      {
        studentId: student3.id,
        classId: informaticaClass.id,
      },
      {
        studentId: student4.id,
        classId: informaticaClass.id,
      },
    ],
  });

  await prisma.familyMember.create({
    data: {
      fullName: "Patrícia Almeida da Silva",
      relationship: "MÃE",
      phoneNumber: "51991234455",
      registrationNumber: "48642629002",
      email: "patricia-familia@example.com",
      student: { connect: [{ id: student1.id }] },
      addressId: familyAddress.id,
      race: "PARDA",
      gender: "FEMININO",
      dateOfBirth: new Date("1983-07-18"),
    },
  });

  await prisma.form.createMany({
    data: [
      {
        title: "Anamnese de Psicologia",
        type: "PSICOLOGIA",
      },
      {
        title: "Anamnese Social",
        type: "SOCIAL",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
