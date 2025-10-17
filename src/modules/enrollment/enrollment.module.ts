import { Module } from "@nestjs/common";
import { EnrollmentController } from "./presentation/enrollment.controller";
import { EnrollmentService } from "./application/enrollment.service";
import { PrismaEnrollmentRepository } from "./infrastructure/enrollment.repository";
import { PrismaEnrollmentQueryService } from "./infrastructure/enrollment.query.service.prisma";
import { ENROLLMENT_REPOSITORY_TOKEN } from "./domain/enrollment.repository";
import { ENROLLMENT_QUERIES_TOKEN } from "./application/enrollment.service.query.interfaces";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [EnrollmentController],
  providers: [
    EnrollmentService,
    {
      provide: ENROLLMENT_REPOSITORY_TOKEN,
      useClass: PrismaEnrollmentRepository,
    },
    {
      provide: ENROLLMENT_QUERIES_TOKEN,
      useClass: PrismaEnrollmentQueryService,
    },
  ],
  exports: [EnrollmentService, ENROLLMENT_REPOSITORY_TOKEN],
})
export class EnrollmentModule {}
