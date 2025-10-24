import { ClassSchedule as Schedule } from "@prisma/client";
import { DayOfWeek } from "src/common/enums/domain.enums";
import { ClassSchedule } from "../domain/class-schedule";

export class ClassScheduleMapper {
  static toDomain(prismaSchedule: Schedule): ClassSchedule {
    const classSchedule: ClassSchedule = {
      id: prismaSchedule.id,
      classId: prismaSchedule.classId,
      daysOfWeek: prismaSchedule.daysOfWeek as DayOfWeek,
    };
    return classSchedule;
  }

  static toPrisma(schedule: ClassSchedule): Omit<Schedule, "id"> {
    return {
      classId: schedule.classId,
      daysOfWeek: schedule.daysOfWeek,
    };
  }

  static toDomainList(prismaSchedules: Schedule[]): ClassSchedule[] {
    return prismaSchedules.map((s) => this.toDomain(s));
  }

  static toPrismaList(schedules: ClassSchedule[]): Omit<Schedule, "id">[] {
    return schedules.map((s) => this.toPrisma(s));
  }
}
