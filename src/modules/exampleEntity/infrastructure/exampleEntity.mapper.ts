import { ExampleEntity as PrismaExampleEntity } from "@prisma/client";
import { ExampleEntity } from "../domain/exampleEntity.entity";
export class ExampleEntityMapper {
    static toDomain(prismaExampleEntity: PrismaExampleEntity): ExampleEntity {
    return new ExampleEntity({
        id: prismaExampleEntity.id,
        name: prismaExampleEntity.name,
        email: prismaExampleEntity.email,
        birthDate: prismaExampleEntity.birthDate
    });
}
    static toPersistence(exampleEntity:ExampleEntity) : PrismaExampleEntity{
        return {
            name : exampleEntity.name,
            id   : exampleEntity.id,
            email :  exampleEntity.email,
            birthDate : exampleEntity.birthDate
        }
    }
}