import { Enrollment } from "../domain/enrollment.entity";
import { Enrollment as PrismaEnrollment } from "@prisma/client";

export class EnrollmentMapper {
  static toDomain(object: PrismaEnrollment): Enrollment {
    return new Enrollment({
      id: object.id,
      studentId: object.studentId,
      classId: object.classId,
      enrollmentDate: object.enrollmentDate,
      endDate: object.endDate,
    });
  }

  static toPersistence(enrollment: Enrollment): Omit<PrismaEnrollment, "id"> {
    return {
      studentId: enrollment.getStudentId(),
      classId: enrollment.getClassId(),
      enrollmentDate: enrollment.getEnrollmentDate(),
      endDate: enrollment.getEndDate(),
    };
  }
}
