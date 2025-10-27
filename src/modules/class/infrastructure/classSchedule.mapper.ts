import { ClassSchedule as PrismaClassSchedule } from "@prisma/client";
import { ClassSchedule } from "../domain/class-schedule";

export class ClassScheduleMapper {
  static toDomain(prismaSchedule: PrismaClassSchedule): ClassSchedule {
    return new ClassSchedule({
      id: prismaSchedule.id,
      classId: prismaSchedule.classId,
      dayOfWeek: prismaSchedule.dayOfWeek,
    });
  }

  static toPersistence(schedule: ClassSchedule, classId: number) {
    return {
      classId: classId,
      dayOfWeek: schedule.daysOfWeek,
    };
  }
}
