import { FormType, PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const levels = ["INICIANTE", "INTERMEDIARIO", "AVANCADO"];
    for (const levelName of levels) {
        await prisma.level.upsert({
            where: { name: levelName },
            update: {},
            create: { name: levelName },
        });
    }
    console.log('Levels seeded successfully.');

    const activities = ["TÊNIS", "INFORMÁTICA"];
    for (const activityName of activities) {
        await prisma.activity.upsert({
            where: { name: activityName },
            update: {},
            create: { name: activityName },
        });
    }
    console.log("Activities seeded successfully.");
    const forms = [
        {
            title: "Anamnese de Psicologia",
            type: FormType.PSICOLOGIA,
        },
        {
            title: "Anamnese Social",
            type: FormType.SOCIAL,
        },
    ];
    const createdForms: { id: number; title: string; type: FormType }[] = [];
    for (const form of forms) {
        const existing = await prisma.form.findFirst({
            where: { 
                title: form.title, 
                type: form.type 
            }
        });

        if (existing) {
            await prisma.form.update({
            where: { id: existing.id },
            data: form,
            });
            createdForms.push(existing);
        } else {
            const created = await prisma.form.create({
            data: form,
            });
            createdForms.push(created);
        }
    }
    console.log("Forms seeded successfully.");
    const psicologiaForm = createdForms.find(f => f.type === FormType.PSICOLOGIA);
    const socialForm = createdForms.find(f => f.type === FormType.SOCIAL);

    if (!psicologiaForm || !socialForm) {
        throw new Error("Forms not found after seeding");
    }
    const psicologiaQuestions = [
        { statement: "Como são os relacionamentos dentro da família? Há conflitos frequentes?", isRequired: true },
        { statement: "Existe suporte emocional da família ou rede de apoio?", isRequired: true },
        { statement: "Há histórico familiar de doenças mentais ou problemas psicológicos?", isRequired: true },
        { statement: "Você tem ou está aguardando acesso a serviços básicos de saúde, educação e assistência?", isRequired: true },
        { statement: "Você possui alguma condição médica crônica? Faz uso de medicações?", isRequired: true },
        { statement: "Como as questões de saúde impactam seu cotidiano e saúde mental?", isRequired: true },
        { statement: "Seu filho usa aparelhos eletrônicos, telas, jogos ou redes sociais?", isRequired: true },
        { statement: "Existe um combinado sobre o tempo de uso?", isRequired: true },
        { statement: "Relação do educando com os familiares?", isRequired: true },
        { statement: "Tem amizades? Como se relaciona com colegas?", isRequired: true },
        { statement: "Tem autonomia para fazer atividades sozinho? Ir a pé para casa/escola?", isRequired: true },
        { statement: "Como lida com frustrações?", isRequired: true },
    ];
    for (const question of psicologiaQuestions) {
        const existing = await prisma.question.findFirst({
            where: {
                formId: psicologiaForm.id,
                statement: question.statement,
            }
        });
        if (existing) {
            await prisma.question.update({
                where: { id: existing.id },
                data: { isRequired: question.isRequired },
                });
        } else {
            await prisma.question.create({
                data: {
                    formId: psicologiaForm.id,
                    statement: question.statement,
                    isRequired: question.isRequired,
                },
            });
        }
    }
    console.log("Psicologia questions seeded successfully.");
    const socialQuestions = [
        { statement: "Em que aspectos acreditam que o projeto pode auxiliar o Educando?", isRequired: true },
        { statement: "Como imaginam o educando no futuro?", isRequired: true },
        { statement: "O educando é filho biológico, adotivo ou outro? Se adotivo, é ciente da adoção?", isRequired: true },
        { statement: "A família possui alguma religião? Se sim, qual?", isRequired: true },
        { statement: "O educando frequentou creches?", isRequired: true },
        { statement: "Com qual idade o educando ingressou na escola?", isRequired: true },
        { statement: "Como foi a adaptação à escola?", isRequired: true },
        { statement: "O educando já estudou em mais de uma escola? Motivo da transferência?", isRequired: true },
        { statement: "O educando já repetiu de série? Quais? Quantas vezes?", isRequired: true },
        { statement: "O educando realiza alguma atividade extracurricular? Qual?", isRequired: true },
        { statement: "O educando possui alguma necessidade especial? Qual?", isRequired: true },
        { statement: "O educando faz uso de medicação controlada? Qual? Como adquire o medicamento?", isRequired: true },
        { statement: "Alergias, seletividade alimentar, restrições alimentares e/ou médicas?", isRequired: true },
    ];
    for (const question of socialQuestions) {
        const existing = await prisma.question.findFirst({
                where: {
                    formId: socialForm.id,
                    statement: question.statement,
                }
            });
        if (existing) {
            await prisma.question.update({
                where: { id: existing.id },
                data: { isRequired: question.isRequired },
            });
        } else {
            await prisma.question.create({
            data: {
                formId: socialForm.id,
                statement: question.statement,
                isRequired: question.isRequired,
            },
            });
        }
    }
console.log("Social questions seeded successfully.");
    const adminEmail = process.env.PROD_ADMIN_EMAIL;
    const firebaseUid = process.env.PROD_ADMIN_FIREBASE_ID;
    const adminFullName = process.env.PROD_ADMIN_FULLNAME;
    if (adminEmail && firebaseUid && adminFullName){
        console.log("Found admin credentials, attempting to seed admin user...");
        const adminUser = await prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (!adminUser) {
            await prisma.user.create({
                data: {
                    fullName: adminFullName,
                    email: adminEmail,
                    uidFirebase: firebaseUid,
                    role: Role.admin
                },
            });
            console.log("Admin user created.");
        } else {
            console.log("Admin user already exists.");
        }
    }else {
    console.warn(
      "Admin credentials (PROD_ADMIN_EMAIL, PROD_ADMIN_FIREBASE_ID, PROD_ADMIN_FULLNAME) not found in environment. Skipping admin seed.",
    );
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });