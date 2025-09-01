-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."FrequencyStatus" AS ENUM ('PRESENT', 'ABSENT');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "uid_firebase" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role_id" INTEGER,
    "address_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student" (
    "id" SERIAL NOT NULL,
    "address_id" INTEGER,
    "full_name" TEXT NOT NULL,
    "date_of_birth" DATE,
    "registration_number" TEXT NOT NULL,
    "enrollment_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disenrollment_date" DATE,
    "status" "public"."StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "level_id" INTEGER,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."address" (
    "id" SERIAL NOT NULL,
    "cep" VARCHAR(9) NOT NULL,
    "street" TEXT NOT NULL,
    "number" VARCHAR(10),
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" VARCHAR(2) NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question" (
    "id" SERIAL NOT NULL,
    "statement" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" JSONB,
    "is_required" BOOLEAN DEFAULT false,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."answer" (
    "id" SERIAL NOT NULL,
    "id_form" INTEGER NOT NULL,
    "id_question" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "level_id" INTEGER NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."frequency" (
    "id" SERIAL NOT NULL,
    "id_student" INTEGER NOT NULL,
    "id_class" INTEGER,
    "date" DATE NOT NULL,
    "status" "public"."FrequencyStatus" NOT NULL DEFAULT 'PRESENT',
    "notes" TEXT,

    CONSTRAINT "frequency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."family" (
    "id" SERIAL NOT NULL,
    "id_student" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."level" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enrollment" (
    "id" SERIAL NOT NULL,
    "id_student" INTEGER NOT NULL,
    "id_class" INTEGER NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."form" (
    "id" SERIAL NOT NULL,
    "id_student" INTEGER NOT NULL,
    "submission_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."doc" (
    "id" SERIAL NOT NULL,
    "id_student" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ClassTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClassTeacher_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_StudentFamily" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_StudentFamily_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uid_firebase_key" ON "public"."user"("uid_firebase");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "public"."role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "student_registration_number_key" ON "public"."student"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "level_name_key" ON "public"."level"("name");

-- CreateIndex
CREATE UNIQUE INDEX "activity_name_key" ON "public"."activity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_id_student_id_class_key" ON "public"."enrollment"("id_student", "id_class");

-- CreateIndex
CREATE UNIQUE INDEX "doc_slug_key" ON "public"."doc"("slug");

-- CreateIndex
CREATE INDEX "_ClassTeacher_B_index" ON "public"."_ClassTeacher"("B");

-- CreateIndex
CREATE INDEX "_StudentFamily_B_index" ON "public"."_StudentFamily"("B");

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer" ADD CONSTRAINT "answer_id_form_fkey" FOREIGN KEY ("id_form") REFERENCES "public"."form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer" ADD CONSTRAINT "answer_id_question_fkey" FOREIGN KEY ("id_question") REFERENCES "public"."question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class" ADD CONSTRAINT "class_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."class" ADD CONSTRAINT "class_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."frequency" ADD CONSTRAINT "frequency_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "public"."student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."frequency" ADD CONSTRAINT "frequency_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "public"."class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."family" ADD CONSTRAINT "family_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enrollment" ADD CONSTRAINT "enrollment_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "public"."student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enrollment" ADD CONSTRAINT "enrollment_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "public"."class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."form" ADD CONSTRAINT "form_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "public"."student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."doc" ADD CONSTRAINT "doc_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "public"."student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClassTeacher" ADD CONSTRAINT "_ClassTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClassTeacher" ADD CONSTRAINT "_ClassTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentFamily" ADD CONSTRAINT "_StudentFamily_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentFamily" ADD CONSTRAINT "_StudentFamily_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
