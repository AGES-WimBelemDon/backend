import { Injectable } from "@nestjs/common";
import { ILevelRepositoryInterface } from "../domain/level.repository.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { Level } from "../domain/level.entity";
import { LevelMapper } from "./level.mapper";


@Injectable()
export class PrismaLevelRepository implements ILevelRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  public async getById(id: number):Promise<Level | null>{
    const level = await this.prisma.level.findFirst({
        where: {id}
    })
    if(!level){
        return null;
    }
    return LevelMapper.toDomain(level);
  }
}