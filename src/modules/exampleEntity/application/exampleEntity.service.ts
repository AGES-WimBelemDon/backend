import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { IExampleEntityRepository, EXAMPLE_ENTITY_REPOSITORY_TOKEN } from "../domain/exampleEntity-repository.interface";
import { CreateExampleEntityDTO } from "./create-exampleEntity.dto";
import { ExampleEntity } from "../domain/exampleEntity.entity";
import { FirebaseService } from "src/modules/firebase/application/firebase.service";

@Injectable()
export class ExampleEntityService{
    @Inject(EXAMPLE_ENTITY_REPOSITORY_TOKEN)
    private readonly exampleEntityRepository: IExampleEntityRepository;
    @Inject(FirebaseService)
    private readonly firebaseAdminService: FirebaseService;
    async createExampleEntity(exampleEntityDto: CreateExampleEntityDTO):Promise<ExampleEntity>{
        const exampleEntityUser = await this.firebaseAdminService.createExampleEntityOnFirebase(exampleEntityDto);
        if(await this.exampleEntityRepository.findByEmail(exampleEntityDto.email)){
            throw new ConflictException("the provided email is already in use");
        }
        const exampleEntity: ExampleEntity = new ExampleEntity({
            "id"   : exampleEntityUser.user.uid,
            "name" : exampleEntityDto.name,
            "email" : exampleEntityDto.email,
            "birthDate" : exampleEntityDto.birthDate
        });
        return await this.exampleEntityRepository.create(exampleEntity);
    };
}