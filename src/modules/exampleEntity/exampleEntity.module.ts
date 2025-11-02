import { Module } from "@nestjs/common";
import { EXAMPLE_ENTITY_REPOSITORY_TOKEN } from "./domain/exampleEntity-repository.interface";
import { ExampleEntityontroller } from "./presentation/exampleEntity.controller";
import { PrismaExampleEntityRepository } from "./infrastructure/exampleEntity.repository";
import { ExampleEntityService } from "./application/exampleEntity.service";
import { FirebaseModule } from "../firebase/firebase.module";

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
  imports: [FirebaseModule]
})
export class ExampleEntityModule {}
