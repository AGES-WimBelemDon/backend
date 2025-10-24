
import { DayOfWeek } from "@prisma/client";
import { Class } from "./class.entity";

export const CLASS_REPOSITORY_TOKEN = "ClassRepository";


export interface IClassRepository {
    create(classEntity: Class, day: string[], teacherIds: number[]): Promise<Class>
    findAll(activityId?: number, levelId?: number, state?: string): Promise<Class[] | []>
    findById(id: number, activityId?: number, levelId?: number, state?: string): Promise<Class | null>
    update(id: number, classEntity: Class)
    delete(classId: number): Promise<void>
}
