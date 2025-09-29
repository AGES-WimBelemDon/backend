import { Injectable } from "@nestjs/common";
import { IExampleEntityRepository } from "../domain/exampleEntity-repository.interface";
import { ExampleEntity } from "../domain/exampleEntity.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { ExampleEntityMapper } from "./exampleEntity.mapper";
@Injectable()
export class PrismaExampleEntityRepository implements IExampleEntityRepository {
    constructor(private readonly prisma: PrismaService) {}
    public async findById(id: string): Promise<ExampleEntity | null> {
        const exampleEntity =  await this.prisma.exampleEntity.findUnique({
            where : {id}
        });
        if(!exampleEntity){
            return null
        }
        return ExampleEntityMapper.toDomain(exampleEntity)
    }
    public async findAll(): Promise<ExampleEntity[]> {
        const exampleEntities = await this.prisma.exampleEntity.findMany();
        if(!exampleEntities){
            return []
        }
        return exampleEntities.map(exampleEntity => ExampleEntityMapper.toDomain(exampleEntity))
    }
    public async create(exampleEntity: ExampleEntity): Promise<ExampleEntity> {
        const createdExampleEntity = await this.prisma.exampleEntity.create({
            data : ExampleEntityMapper.toPersistence(exampleEntity)
        }
        );
        return ExampleEntityMapper.toDomain(createdExampleEntity);
    }
    public async delete(id: string): Promise<void> {
        await this.prisma.exampleEntity.delete({
            where: { id }
        });
    };
    public async findByEmail(email: string): Promise<ExampleEntity | null>{
        const exampleEntity =  await this.prisma.exampleEntity.findUnique({
            where : {email}
        });
        if(!exampleEntity){
            return null
        }
        return ExampleEntityMapper.toDomain(exampleEntity)
    }
    
}