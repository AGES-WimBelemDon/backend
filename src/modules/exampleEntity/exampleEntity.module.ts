import { Module } from "@nestjs/common";
//import { IStudentRepository } from "./domain/student-repository.interface";
import { EXAMPLE_ENTITY_REPOSITORY_TOKEN } from "./domain/exampleEntity-repository.interface";
import { ExampleEntityontroller } from "./presentation/exampleEntity.controller";
import { PrismaExampleEntityRepository } from "./infrastructure/exampleEntity.repository";
import { ExampleEntityService } from "./application/exampleEntity.service";

@Module({
    controllers : [ExampleEntityontroller],
    providers: [
        {
            provide: EXAMPLE_ENTITY_REPOSITORY_TOKEN,
            useClass: PrismaExampleEntityRepository
        },
        ExampleEntityService,     
    ],
  exports: [EXAMPLE_ENTITY_REPOSITORY_TOKEN, ExampleEntityService],
})
export class ExampleEntityModule {}
