import { Level } from "../domain/level.entity";
import { Level as PrismaLevel}  from "@prisma/client";

export class LevelMapper{
  static toDomain(prismaObj: PrismaLevel): Level {
    return new Level({
      id: prismaObj.id,
      name: prismaObj.name,
      description: prismaObj.description
    })
  }
}