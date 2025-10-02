
import { Class as PrismaClass } from "@prisma/client";
import { Class } from "../domain/class.entity";
import { ClassResponseDTO } from "../application/class-response.dto";

export class ClassMapper {
    static toDomain(prismaClass: PrismaClass): Class {
        return new Class({
            id: prismaClass.id,
            name: prismaClass.name,
            activityId: prismaClass.activityId,
            levelId: prismaClass.levelId,
            state: prismaClass.state,
            studentsIds: [], 
            teacherIds: [], 
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

    static toResponse(classEntity: Class): ClassResponseDTO {  
        const responseDto = new ClassResponseDTO();  
        responseDto.id = classEntity.getId()|| 0;  
        responseDto.name = classEntity.getName();  
        responseDto.activityId = classEntity.getActivityId();  
        responseDto.levelId = classEntity.getLevelId();  
        responseDto.state = classEntity.getState();  
        responseDto.studentsIds = classEntity.getStudentsIds();  
        responseDto.teacherIds = classEntity.getTeacherIds();  
        
        return responseDto;  
    }  
}
