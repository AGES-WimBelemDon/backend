import { Frequency, FrequencyStatus } from "../domain/frequency.entity";
import { FrequencyStatus as PrismaFrequencyStatus, Frequency as PrismaFrequency } from "@prisma/client";
export class FrequencyMapper{
    static toDomain(object: PrismaFrequency): Frequency{
        return new Frequency({
            id: object.id,
            studentId: object.studentId,
            classId: object.classId,
            date: object.date,
            status: object.status===PrismaFrequencyStatus.PRESENTE?FrequencyStatus.PRESENTE:FrequencyStatus.AUSENTE,
            notes: object.notes,
        })
    };
}