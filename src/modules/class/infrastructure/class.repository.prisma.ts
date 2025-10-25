import { IClassRepository } from "../domain/class.repository.interface";
import { Class } from "../domain/class.entity";
import { Injectable } from "@nestjs/common";
import { ClassMapper } from "./class.mapper";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class ClassRepository implements IClassRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(classObj: Class): Promise<Class> {
    const teacherIds = classObj.getTeachers().map((t) => t.id);
    const schedules = classObj.getSchedules();
    const classInstance = ClassMapper.toPersistence(classObj);
    const createSchedules = schedules.map((schedule) => ({
      dayOfWeek: schedule.daysOfWeek,
    }));
    const teachersIdsConnect = teacherIds.map((id) => ({ id }));
    const createdClass = await this.prisma.class.create({
      data: {
        ...classInstance,
        teacher: {
          connect: teachersIdsConnect,
        },
        schedules: {
          create: createSchedules,
        },
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
          },
        },
        schedules: true,
      },
    });

    return ClassMapper.toDomain(createdClass);
  }
}
