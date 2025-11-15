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
        } else {
            await prisma.form.create({
            data: form,
            });
        }
    }
    console.log("Forms seeded successfully.");

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