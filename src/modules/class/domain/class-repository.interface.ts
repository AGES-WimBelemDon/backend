
import { Class } from "./class.entity";

export const CLASS_REPOSITORY_TOKEN = "ClassRepository";


export interface IClassRepository {
    create(classEntity: Class): Promise<Class>
    findById(classId: number): Promise<Class | null>
    findAll(): Promise<Class[]>
    delete(classId: number): Promise<void>
    update(classId: number, classEntity: Partial<Class>): Promise<Class>
}
