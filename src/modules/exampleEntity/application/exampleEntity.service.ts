import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { IExampleEntityRepository, EXAMPLE_ENTITY_REPOSITORY_TOKEN } from "../domain/exampleEntity-repository.interface";
import { CreateExampleEntityDTO } from "./create-exampleEntity.dto";
import { ExampleEntity } from "../domain/exampleEntity.entity";

@Injectable()
export class ExampleEntityService{
    @Inject(EXAMPLE_ENTITY_REPOSITORY_TOKEN)
    private readonly exampleEntityRepository: IExampleEntityRepository;
    async createExampleentity(exampleEntityDto: CreateExampleEntityDTO):Promise<ExampleEntity>{
        if(await this.exampleEntityRepository.findByEmail(exampleEntityDto.email)){
            throw new ConflictException("the provided email already was used");
        }
        const exampleEntity: ExampleEntity = new ExampleEntity({
            "name" : exampleEntityDto.name,
            "email" : exampleEntityDto.email,
            "birthDate" : exampleEntityDto.birthDate
        });
        return await this.exampleEntityRepository.create(exampleEntity);
    };
}