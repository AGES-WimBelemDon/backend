
import { Module } from "@nestjs/common";
import { ClassController } from "./presentation/class.controller";
import { ClassService } from "./application/class.service";
import { ClassRepository } from "./infrastructure/class.repository";
import { CLASS_REPOSITORY_TOKEN } from "./domain/class-repository.interface";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [ClassController],
    providers: [
        ClassService,
        {
            provide: CLASS_REPOSITORY_TOKEN,
            useClass: ClassRepository,
        },
    ],
    exports: [ClassService, CLASS_REPOSITORY_TOKEN],
})
export class ClassModule {}
