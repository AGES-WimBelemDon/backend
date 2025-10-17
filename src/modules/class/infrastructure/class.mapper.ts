import { Class as PrismaClass } from "@prisma/client";
import { Class } from "../domain/class.entity";
import { ClassResponseDTO } from "../application/class-response.dto";
import { UpdateClassDTO } from "../application/update-class.dto";

export class ClassMapper {
  static toDomain(prismaClass: PrismaClass): Class {
    return new Class({
      id: prismaClass.id,
      name: prismaClass.name,
      activityId: prismaClass.activityId,
      levelId: prismaClass.levelId,
      state: prismaClass.state,
      teacherIds: [],
      isRecurrent: prismaClass.isRecurrent,
      startDate: prismaClass.startDate,
      endDate: prismaClass.endDate ?? undefined,
      startTime: prismaClass.startTime,
      endTime: prismaClass.endTime,
      schedulesIds: [],
    });
  }

  static toPrisma(classEntity: Class): Omit<PrismaClass, "id"> {
    return {
      name: classEntity.getName(),
      activityId: classEntity.getActivityId(),
      levelId: classEntity.getLevelId(),
      state: classEntity.getState(),
      isRecurrent: classEntity.getIsRecurrent(),
      startDate: classEntity.getStartDate(),
      endDate: classEntity.getEndDate(),
      startTime: classEntity.getStartTime(),
      endTime: classEntity.getEndTime(),
    };
  }

  static toResponse(classEntity: Class): ClassResponseDTO {
    const responseDto = new ClassResponseDTO();
    responseDto.id = classEntity.getId() || 0;
    responseDto.name = classEntity.getName();
    responseDto.activityId = classEntity.getActivityId();
    responseDto.levelId = classEntity.getLevelId();
    responseDto.state = classEntity.getState();
    responseDto.teacherIds = classEntity.getTeacherIds();
    responseDto.schedulesIds = classEntity.getSchedulesIds();

    return responseDto;
  }

  static updateToDomain(classEntity: Class, updateClassDto: UpdateClassDTO) {
    function safeDate(value: any, fallback: Date, fieldName: string): Date {
      if (!value) return fallback;
  
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format for '${fieldName}': ${value}`);
      }
  
      return date;
    }
  
    return new Class({
      id: classEntity.id,
      name: updateClassDto.name ?? classEntity.name,
      activityId: updateClassDto.activityId ?? classEntity.activityId,
      levelId: updateClassDto.levelId ?? classEntity.levelId,
      state: updateClassDto.state ?? classEntity.state,
      teacherIds: updateClassDto.teachersId ?? classEntity.teacherIds,
      isRecurrent: updateClassDto.isRecurrent ?? classEntity.isRecurrent,
  
      startDate: safeDate(updateClassDto.startDate, classEntity.startDate, "startDate"),
      endDate: updateClassDto.endDate
        ? safeDate(updateClassDto.endDate, classEntity.endDate ?? new Date(), "endDate")
        : classEntity.endDate,
  
      startTime: safeDate(updateClassDto.startTime, classEntity.startTime, "startTime"),
      endTime: safeDate(updateClassDto.endTime, classEntity.endTime, "endTime"),
  
      schedulesIds: updateClassDto.schedulesIds ?? classEntity.schedulesIds,
    });
  }
  
}
