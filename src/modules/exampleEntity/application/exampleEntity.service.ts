import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { IExampleEntityRepository, EXAMPLE_ENTITY_REPOSITORY_TOKEN } from "../domain/exampleEntity-repository.interface";
import { CreateExampleEntityDTO } from "./create-exampleEntity.dto";
import { ExampleEntity } from "../domain/exampleEntity.entity";

@Injectable()
export class ExampleEntityService{
    @Inject(EXAMPLE_ENTITY_REPOSITORY_TOKEN)
    private readonly exampleEntityRepository: IExampleEntityRepository;
    async createExampleEntity(exampleEntityDto: CreateExampleEntityDTO):Promise<ExampleEntity>{
        if(await this.exampleEntityRepository.findByEmail(exampleEntityDto.email)){
            throw new ConflictException("the provided email is already in use");
        }
        const exampleEntity: ExampleEntity = new ExampleEntity({
            "name" : exampleEntityDto.name,
            "email" : exampleEntityDto.email,
            "birthDate" : exampleEntityDto.birthDate
        });
        return await this.exampleEntityRepository.create(exampleEntity);
    };
}