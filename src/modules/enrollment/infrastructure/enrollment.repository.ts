import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Enrollment } from "../domain/enrollment.entity";
import { IEnrollmentRepository } from "../domain/enrollment.repository";
import { EnrollmentMapper } from "./enrollment.mapper";

@Injectable()
export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const data = EnrollmentMapper.toPersistence(enrollment);
    const result = await this.prisma.enrollment.create({
      data,
    });
    return EnrollmentMapper.toDomain(result);
  }

  async createMany(enrollments: Enrollment[]): Promise<Enrollment[]> {
    const createdEnrollments: Enrollment[] = [];
    
    for (const enrollment of enrollments) {
      const data = EnrollmentMapper.toPersistence(enrollment);
      const result = await this.prisma.enrollment.create({
        data,
      });
      createdEnrollments.push(EnrollmentMapper.toDomain(result));
    }
    
    return createdEnrollments;
  }

  async findById(id: number): Promise<Enrollment | null> {
    const result = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    
    if (!result) return null;
    
    return EnrollmentMapper.toDomain(result);
  }

  async findActiveByStudentAndClass(
    studentId: number,
    classId: number,
  ): Promise<Enrollment | null> {
    const result = await this.prisma.enrollment.findFirst({
      where: {
        studentId,
        classId,
        endDate: null,
      },
    });
    
    if (!result) return null;
    
    return EnrollmentMapper.toDomain(result);
  }

  async update(enrollment: Enrollment): Promise<Enrollment> {
    const id = enrollment.getId();
    if (!id) {
      throw new Error("Cannot update enrollment without id");
    }

    const data = EnrollmentMapper.toPersistence(enrollment);
    const result = await this.prisma.enrollment.update({
      where: { id },
      data,
    });
    
    return EnrollmentMapper.toDomain(result);
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.prisma.enrollment.update({
      where: { id },
      data: {
        endDate: new Date(),
      },
    });
    
    return result !== null;
  }
}
