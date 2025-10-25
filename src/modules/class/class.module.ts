import { Module } from "@nestjs/common";
import { ClassController } from "./presentation/class.controller";
import { ClassService } from "./application/class.service";
import { LevelModule } from "../level/level.module";
import { CLASS_QUERIES_TOKEN } from "./application/class.service.query.interfaces";
import { ClassQueryServicePrisma } from "./infrastructure/class.query.service.prisma";

@Module({
    imports: [LevelModule],
    controllers: [ClassController],
    providers: [
        ClassService,
        {
            provide : CLASS_QUERIES_TOKEN,
            useClass: ClassQueryServicePrisma
        }
    ]
})
export class ClassModule {}