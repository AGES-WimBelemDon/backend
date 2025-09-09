import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IFrequencyQueries } from "../application/frequency.service.query.interfaces";
import { UserClassesDTO } from "../application/frequency.dtos";
import { FrequencyDTOMapper } from "./frequency.dto.mapper";

@Injectable()
export class PrismaFrequencyQueryService implements IFrequencyQueries {
    constructor(private readonly prisma: PrismaService) {}
    async getMyClasses(userId: number): Promise<UserClassesDTO[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        classes: {
          select: {
            id: true,
            name: true,
            state: true,
            level: {
              select: {
                name: true,
              },
            },
            activity: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.classes) {
      return [];
    }
    return user.classes.map(cls => FrequencyDTOMapper.toUserClassesDTO(cls));
  }
}