import {
  Class as PrismaClass,
  ClassSchedule as PrismaClassSchedule,
} from "@prisma/client";
import { Class } from "../domain/class.entity";
import { Teacher } from "../domain/teacher";
import { ClassScheduleMapper } from "./classSchedule.mapper";

type PrismaClassWithRelations = PrismaClass & {
  teacher?: { id: number; fullName: string }[];
  schedules?: PrismaClassSchedule[];
};

export class ClassMapper {
  static toDomain(prismaClass: PrismaClassWithRelations): Class {
    return new Class({
      id: prismaClass.id,
      name: prismaClass.name,
      activityId: prismaClass.activityId,
      levelId: prismaClass.levelId,
      state: prismaClass.state,
      teachers:
        prismaClass.teacher?.map((t) => new Teacher(t.id, t.fullName)) || [],
      isRecurrent: prismaClass.isRecurrent,
      startDate: prismaClass.startDate,
      endDate: prismaClass.endDate ?? undefined,
      startTime: prismaClass.startTime,
      endTime: prismaClass.endTime,
      schedules:
        prismaClass.schedules?.map((s) => ClassScheduleMapper.toDomain(s)) ||
        [],
    });
  }

  static toPersistence(classObj: Class) {
    return {
      name: classObj.getName(),
      activityId: classObj.getActivityId(),
      levelId: classObj.getLevelId(),
      state: classObj.getState(),
      isRecurrent: classObj.getIsRecurrent(),
      startDate: classObj.getStartDate(),
      endDate: classObj.getEndDate(),
      startTime: classObj.getStartTime(),
      endTime: classObj.getEndTime(),
    };
  }
}
