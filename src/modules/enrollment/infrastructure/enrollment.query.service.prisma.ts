import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  EnrollmentQueryFilters,
  IEnrollmentQueries,
} from "../application/enrollment.service.query.interfaces";
import { EnrollmentListItemDTO } from "../application/dtos";
import { StudentStatus } from "@prisma/client";

@Injectable()
export class PrismaEnrollmentQueryService implements IEnrollmentQueries {
  constructor(private readonly prisma: PrismaService) {}

  async findEnrollments(
    filters: EnrollmentQueryFilters,
  ): Promise<EnrollmentListItemDTO[]> {
    const where: any = {};

    if (filters.classId !== undefined) {
      where.classId = filters.classId;
    }

    if (filters.studentId !== undefined) {
      where.studentId = filters.studentId;
    }

    const endDateNull = filters.endDateNull !== undefined ? filters.endDateNull : true;
    if (endDateNull) {
      where.endDate = null;
    }

    if (filters.studentStatus && filters.studentStatus !== "ALL") {
      where.student = {
        status: filters.studentStatus as StudentStatus,
      };
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            status: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        enrollmentDate: "desc",
      },
    });

    return enrollments.map((enrollment) => ({
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
    }));
  }
}
