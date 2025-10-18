import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  EnrollmentQueryFilters,
  IEnrollmentQueries,
} from "../application/enrollment.service.query.interfaces";
import { EnrollmentListItemDTO } from "../application/dtos";
import { StudentStatus } from "@prisma/client";
import { EnrollmentMapper } from "./enrollment.mapper";

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

    return enrollments.map(EnrollmentMapper.toListItemDto);
  }
  async findEnrollmentWithStudentAndClass(id: number): Promise<EnrollmentListItemDTO | null>{
    const enrollmentData = await this.prisma.enrollment.findUnique({
      where: { id },
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
    });
    if(!enrollmentData){
      return null;
    }
    return EnrollmentMapper.toListItemDto(enrollmentData);
  }
}
