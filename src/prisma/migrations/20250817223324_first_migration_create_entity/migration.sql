-- CreateTable
CREATE TABLE "public"."ExampleEntity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExampleEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExampleEntity_email_key" ON "public"."ExampleEntity"("email");
