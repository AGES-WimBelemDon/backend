
import { Module } from "@nestjs/common";
import { ClassController } from "./presentation/class.controller";
import { ClassService } from "./application/class.service";
import { ClassRepository } from "./infrastructure/class.repository";
import { CLASS_REPOSITORY_TOKEN } from "./domain/class-repository.interface";
import { PrismaModule } from "src/prisma/prisma.module";
import { StudentModule } from "../student/student.module";
import { LevelModule } from "../level/level.module";
import { ClassScheduleRepository } from "./infrastructure/class-schedule.repository";
import { CLASS_SCHEDULE_REPOSITORY_TOKEN } from "./domain/class-schedule-repository.interface";

@Module({
    imports: [PrismaModule,LevelModule],
    controllers: [ClassController],
    providers: [
        ClassService,
        {
            provide: CLASS_REPOSITORY_TOKEN,
            useClass: ClassRepository,
        },
        {
            provide: CLASS_SCHEDULE_REPOSITORY_TOKEN,
            useClass: ClassScheduleRepository
        }
    ],
    exports: [ClassService, CLASS_REPOSITORY_TOKEN],
})
export class ClassModule {}
