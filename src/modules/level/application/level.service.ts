import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Level } from "../domain/level.entity";
import { ILevelRepositoryInterface, LEVEL_REPOSITORY_TOKEN } from "../domain/level.repository.interface";
@Injectable()
export class LevelService{
    constructor(
        @Inject(LEVEL_REPOSITORY_TOKEN)
        private readonly levelRepository: ILevelRepositoryInterface
    ){}
    public async getById(id: number):Promise<Level>{
        const level = await this.levelRepository.getById(id);
        if(!level){
            throw new NotFoundException(`Level with ID ${id} not found`);
        };
        return level;
    }
    public async findAll(): Promise<Level[]>{
        return await this.levelRepository.findAll();
    }
    
}