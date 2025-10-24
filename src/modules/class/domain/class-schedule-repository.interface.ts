
import { ClassSchedule} from "@prisma/client";

export const CLASS_SCHEDULE_REPOSITORY_TOKEN = "ClassScheduleRepository";

export interface IClassScheduleRepository {
    findAll(): Promise<ClassSchedule[] | []>
    findById(id: number): Promise<ClassSchedule | null>
}
