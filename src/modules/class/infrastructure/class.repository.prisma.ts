import { IClassRepository } from "../domain/class.repository.interface";
import { Class } from "../domain/class.entity";
import { Injectable } from "@nestjs/common";
import { ClassMapper } from "./class.mapper";
import { PrismaService } from "src/prisma/prisma.service";
import { ClassQueryFilters } from "../application/dtos";
import { ClassState, StudentStatus } from "src/common/enums/domain.enums";
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
        where.state = filters.state as ClassState;
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
    async findMyClasses(userId: number,
      filters: ClassQueryFilters): Promise<Class[]> {
      const where: any = {};
      where.teacher = {
        some : {id : userId}
      }
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
        where.state = filters.state as ClassState;
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
  async findById(classId: number): Promise<Class | null> {
    const classInstance = await this.prisma.class.findUnique({
      where: {
        id: classId
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
    
    if (!classInstance) {
      return null;
    }
    return ClassMapper.toDomain(classInstance);
  }
  async update(classObj: Class): Promise<Class> {
    const classId = classObj.getId()!;
    const teacherIds = classObj.getTeachers().map((t) => t.id);
    const schedules = classObj.getSchedules();
    const classData = ClassMapper.toPersistence(classObj);

    const updatedClass = await this.prisma.class.update({
      where: { id: classId },
      data: {
        name: classData.name,
        activityId: classData.activityId,
        levelId: classData.levelId,
        state: classData.state,
        isRecurrent: classData.isRecurrent,
        startDate: classData.startDate,
        endDate: classData.endDate,
        startTime: classData.startTime,
        endTime: classData.endTime,
        teacher: {
          set: teacherIds.map((id) => ({ id })),
        },
        schedules: {
          deleteMany: {},
          create: schedules.map((schedule) => ({
            dayOfWeek: schedule.daysOfWeek,
          })),
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

    return ClassMapper.toDomain(updatedClass);
  }
}
