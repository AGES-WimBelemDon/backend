import { IClassRepository } from "../domain/class.repository.interface";
import { Class } from "../domain/class.entity";
import { Injectable } from "@nestjs/common";
import { ClassMapper } from "./class.mapper";
import { PrismaService } from "src/prisma/prisma.service";
import { ClassQueryFilters } from "../application/dtos";
import { StudentStatus } from "src/common/enums/domain.enums";
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
  async findClasses(
      filters: ClassQueryFilters,
    ): Promise<Class[]> {
      const where: any = {};
  
      if (filters.classId !== undefined) {
        where.id = filters.classId;
      }
  
      if (filters.levelId !== undefined) {
        where.levelId = filters.levelId;
      }
      if(filters.activityId !== undefined){
        where.activityId = filters.activityId;
      }
  
      if (filters.state && filters.state !== "ALL") {
        where.state = filters.state as StudentStatus;
      }
  
      const classes = await this.prisma.class.findMany({
        where,
        include: {
          teacher: {
            select: {
              id: true,
              fullName: true,
            },
          },
          schedules: true,
        },
          orderBy: {
            id: "asc",
          },
        });
  
      return classes.map((item) => ClassMapper.toDomain(item));
    }
}
