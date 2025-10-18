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
      data: ClassMapper.toPrisma(classEntity),
    });

    return ClassMapper.toDomain(prismaClass);
  }

  async findById(
    id: number,
    activityId?: number,
    levelId?: number,
    state?: string
  ): Promise<Class | null> {
    const where: any = { id };

    if (activityId !== undefined) where.activityId = activityId;
    if (levelId !== undefined) where.levelId = levelId;
    if (state !== undefined) where.state = state;
  
    const prismaClass = await this.prisma.class.findFirst({ where });

    if (!prismaClass) {
      return null;
    }

    return ClassMapper.toDomain(prismaClass);
  }

  async findAll(
    activityId?: number,
    levelId?: number,
    state?: string
  ): Promise<Class[] | []> {
    const prismaClass = await this.prisma.class.findMany({
      where: {
        ...(activityId && { activityId: Number(activityId) }),
        ...(levelId && { levelId: Number(levelId) }),
        ...(state && { state }),
      },
    });
    if (!prismaClass) {
      return [];
    }

    return prismaClass.map(ClassMapper.toDomain);
  }

  async update(id: number, classEntity: Class) {
    const prismaClass = await this.prisma.class.update({
      where: { id },
      data: ClassMapper.toPrisma(classEntity),
    });
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
