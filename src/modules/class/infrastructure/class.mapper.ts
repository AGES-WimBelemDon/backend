
import { Class as PrismaClass } from "@prisma/client";
import { Class } from "../domain/class.entity";

export class ClassMapper {
    static toDomain(prismaClass: PrismaClass): Class {
        return new Class({
            id: prismaClass.id,
            name: prismaClass.name,
            activityId: prismaClass.activityId,
            levelId: prismaClass.levelId,
            state: prismaClass.state,
            studentsIds: [], // This needs to be fetched separately
            teacherIds: [], // This needs to be fetched separately
        });
    }

    static toPrisma(classEntity: Class): Omit<PrismaClass, 'id'> {
        return {
            name: classEntity.getName(),
            activityId: classEntity.getActivityId(),
            levelId: classEntity.getLevelId(),
            state: classEntity.getState(),
        };
    }

    static toResponse(classEntity: Class) {
        return {
            id: classEntity.getId(),
            name: classEntity.getName(),
            activityId: classEntity.getActivityId(),
            levelId: classEntity.getLevelId(),
            state: classEntity.getState(),
            studentsIds: classEntity.getStudentsIds(),
            teacherIds: classEntity.getTeacherIds(),
        };
    }
}
