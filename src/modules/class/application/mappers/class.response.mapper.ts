import { Class } from "../../domain/class.entity";
import { ClassResponseDTO } from "../dtos/class.response.dto";

export class ClassResponseMapper {
  static toDTO(classEntity: Class): ClassResponseDTO {
    return {
      id: classEntity.getId()!,
      name: classEntity.getName(),
      activityId: classEntity.getActivityId(),
      levelId: classEntity.getLevelId(),
      state: classEntity.getState(),
      teachers: classEntity.getTeachers().map((teacher) => ({
        id: teacher.id,
        fullName: teacher.fullName,
      })),
      isRecurrent: classEntity.getIsRecurrent(),
      startDate: ClassResponseMapper.formatDate(classEntity.getStartDate()),
      endDate: classEntity.getEndDate()
        ? ClassResponseMapper.formatDate(classEntity.getEndDate()!)
        : null,
      startTime: this.formatTime(classEntity.getStartTime()),
      endTime: this.formatTime(classEntity.getEndTime()),
      schedules: classEntity.getSchedules().map((schedule) => ({
        id: schedule.id!,
        dayOfWeek: schedule.daysOfWeek,
      })),
    };
  }

  private static formatTime(date: Date): string {
    return date.toTimeString().split(" ")[0];
  }
  private static formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }
}
