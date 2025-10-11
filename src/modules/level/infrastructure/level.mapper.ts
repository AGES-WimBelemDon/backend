import { LevelResponseDTO } from "../application/level.response.dto";
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
  static toResponse(level: Level): LevelResponseDTO {
    const id = level.getId() ?? 0;
    const name = level.getName();
    const description = level.getDescription() ?? null;
    return { id, name, description };
}
}