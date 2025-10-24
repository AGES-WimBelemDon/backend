import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IClassRepository } from "../domain/class-repository.interface";
import { Class } from "../domain/class.entity";
import { ClassMapper } from "./class.mapper";
import { DayOfWeek } from "@prisma/client";
import { ClassSchedule } from "../domain/class-schedule";

@Injectable()
export class ClassRepository implements IClassRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    classEntity: Class,
    days: DayOfWeek[],
    teacherIds: number[]
  ): Promise<Class> {
    const tx = await this.prisma.$transaction(async (tx) => {
      const createdClass = await tx.class.create({
        data: ClassMapper.toPrisma(classEntity),
      });

      const schedules : ClassSchedule[] = []

      days.forEach(async element => {
        const scheduleCreation = await tx.classSchedule.create({
          data: { classId: createdClass.id, daysOfWeek: element },
        });

        schedules.push(scheduleCreation);
      });

      

      return { createdClass, schedules };
    });

    return ClassMapper.toDomain(tx.createdClass, tx.schedules);
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

    return prismaClass.map((prismaClassItem) =>
      ClassMapper.toDomain(prismaClassItem, undefined)
    );
  }

  async update(id: number, classEntity: Class) {
    const data = ClassMapper.toPrisma(classEntity);
    const prismaClass = await this.prisma.class.update({
      where: { id },
      data: {
        ...data,
        schedules: {
          set: classEntity.schedules.map((s) => ({ id: s.id })),
        },
      },
      include: { schedules: true },
    });

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
