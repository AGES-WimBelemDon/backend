import { Module } from "@nestjs/common";
import { ClassController } from "./presentation/class.controller";
import { ClassService } from "./application/class.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { LevelModule } from "../level/level.module";

@Module({
    imports: [LevelModule],
    controllers: [ClassController],
    providers: [
        ClassService,
    ]
})
export class ClassModule {}