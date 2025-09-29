import { Frequency } from "../domain/frequency.entity";
import {
  FrequencyStatus as PrismaFrequencyStatus,
  Frequency as PrismaFrequency,
  FrequencyStatus,
} from "@prisma/client";
export class FrequencyMapper {
  static toDomain(object: PrismaFrequency): Frequency {
    return new Frequency({
      id: object.id,
      studentId: object.studentId,
      classId: object.classId,
      date: object.date,
      status:
        object.status === PrismaFrequencyStatus.PRESENTE
          ? FrequencyStatus.PRESENTE
          : FrequencyStatus.AUSENTE,
      notes: object.notes,
    });
  }
  static createFrequencyToPersistence(
    object: Frequency,
  ): Omit<PrismaFrequency, "id"> {
    return {
      studentId: object.getStudentId(),
      classId: object.getClassId(),
      date: object.getDate(),
      status: object.getStatus(),
      notes: object.getNotes(),
    };
  }
}
