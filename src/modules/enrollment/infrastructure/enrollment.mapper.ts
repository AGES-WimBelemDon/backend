import { EnrollmentListItemDTO } from "../application/dtos/enrollment-list.response.dto";
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
  static toListItemDto(enrollment: any): EnrollmentListItemDTO {
    return {
      id: enrollment.id,
      student: {
        id: enrollment.student.id,
        fullName: enrollment.student.fullName,
        status: enrollment.student.status,
      },
      class: {
        id: enrollment.class.id,
        name: enrollment.class.name,
      },
      enrollmentDate: enrollment.enrollmentDate.toISOString().split("T")[0],
      endDate: enrollment.endDate
        ? enrollment.endDate.toISOString().split("T")[0]
        : null,
    };
  }
}
