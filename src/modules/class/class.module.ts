import { Module } from "@nestjs/common";
import { ClassController } from "./presentation/class.controller";
import { ClassService } from "./application/class.service";
import { LevelModule } from "../level/level.module";
import { CLASS_QUERIES_TOKEN } from "./application/class.service.query.interfaces";
import { ClassQueryServicePrisma } from "./infrastructure/class.query.service.prisma";
import { ClassRepository } from "./infrastructure/class.repository.prisma";
import { CLASS_REPOSITORY_TOKEN } from "./domain/class.repository.interface";
import { EnrollmentModule } from "../enrollment/enrollment.module";

@Module({
  imports: [LevelModule, EnrollmentModule],
  controllers: [ClassController],
  providers: [
    ClassService,
    {
      provide: CLASS_QUERIES_TOKEN,
      useClass: ClassQueryServicePrisma,
    },
    {
      provide: CLASS_REPOSITORY_TOKEN,
      useClass: ClassRepository,
    },
  ],
})
export class ClassModule {}
