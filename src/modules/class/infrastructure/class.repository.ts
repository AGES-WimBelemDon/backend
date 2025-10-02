import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IClassRepository } from "../domain/class-repository.interface";
import { Class } from "../domain/class.entity";
import { ClassMapper } from "./class.mapper";

@Injectable()
export class ClassRepository implements IClassRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(classEntity: Class): Promise<Class> {
    const prismaClass = await this.prisma.class.create({
      data: {
        name: classEntity.getName(),
        activityId: classEntity.getActivityId(),
        levelId: classEntity.getLevelId(),
        state: classEntity.getState(),
      },
    });

    return ClassMapper.toDomain(prismaClass);
  }

  async findById(id: number): Promise<Class | null> {
    const prismaClass = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!prismaClass) {
      return null;
    }

    return ClassMapper.toDomain(prismaClass);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.enrollment.deleteMany({
        where: { classId: id },
      });
      await tx.frequency.deleteMany({
        where: { classId: id },
      });
      await tx.class.delete({
        where: { id },
      });
    });
  }
}
