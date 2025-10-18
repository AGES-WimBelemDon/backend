import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  ENROLLMENT_REPOSITORY_TOKEN,
  IEnrollmentRepository,
} from "../domain/enrollment.repository";
import {
  ENROLLMENT_QUERIES_TOKEN,
  IEnrollmentQueries,
  EnrollmentQueryFilters,
} from "./enrollment.service.query.interfaces";
import {
  CreateEnrollmentRequestDTO,
  CreateEnrollmentResponseDTO,
  EnrollmentListItemDTO,
  ReactivateEnrollmentResponseDTO,
  EnrollmentItemDTO,
  EnrollmentWarningDTO,
} from "./dtos";
import { Enrollment } from "../domain/enrollment.entity";
import { StudentService } from "src/modules/student/application/student.service";

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY_TOKEN)
    private readonly enrollmentRepository: IEnrollmentRepository,

    @Inject(ENROLLMENT_QUERIES_TOKEN)
    private readonly enrollmentQueryService: IEnrollmentQueries,
    @Inject(StudentService)
    private readonly studentService: StudentService,) {}

  async createEnrollments(
    data: CreateEnrollmentRequestDTO,
  ): Promise<CreateEnrollmentResponseDTO> {
    const { classId, studentIds } = data;
    // TODO: it's necessary to validate the class
    //const classExists = await this.prisma.class.findUnique({
    //  where: { id: classId },
    //});
    console.warn("WARNING: Class service validation not implemented yet");
    const classExists = false; // TEMPORARY: Assuming class exists until validation is implemented
    if (!classExists) {
      throw new NotFoundException(`Class with ID ${classId} not found.`);
    }

    const students = await this.studentService.findManyById(studentIds);

    const foundStudentIds = students.map((s) => s.getId());
    const missingStudentIds = studentIds.filter(
      (id) => !foundStudentIds.includes(id),
    );

    if (missingStudentIds.length > 0) {
      throw new NotFoundException(
        `Students with IDs ${missingStudentIds.join(", ")} not found.`,
      );
    }

    const created: EnrollmentItemDTO[] = [];
    const warnings: EnrollmentWarningDTO[] = [];

    for (const studentId of studentIds) {
      const existingEnrollment =
        await this.enrollmentRepository.findActiveByStudentAndClass(
          studentId,
          classId,
        );

      if (existingEnrollment) {
        warnings.push({
          studentId,
          code: "ALREADY_ACTIVE",
          message: `Student ${studentId} já possui matrícula ativa na turma ${classId}.`,
        });
        continue;
      }
      const enrollment = new Enrollment({
        id: null,
        studentId,
        classId,
        enrollmentDate: new Date(),
        endDate: null,
      });

      const createdEnrollment =
        await this.enrollmentRepository.create(enrollment);
      const student = students.find((s) => s.getId() === studentId);

      created.push({
        id: createdEnrollment.getId()!,
        student: {
          id: student!.getId()!,
          fullName: student!.getFullName(),
          status: student!.getStatus(),
        },
        enrollmentDate: createdEnrollment
          .getEnrollmentDate()
          .toISOString()
          .split("T")[0],
        endDate: null,
      });
    }

    return {
      classId,
      created,
      warnings,
    };
  }

  async findEnrollments(
    filters: EnrollmentQueryFilters,
  ): Promise<EnrollmentListItemDTO[]> {
    return await this.enrollmentQueryService.findEnrollments(filters);
  }

  async reactivateEnrollment(
    id: number,
  ): Promise<ReactivateEnrollmentResponseDTO> {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found.`);
    }

    const enrollmentData = await this.enrollmentQueryService.findEnrollmentWithStudentAndClass(id);
    if (!enrollmentData) {
      throw new NotFoundException(`Enrollment with ID ${id} not found.`);
    }

    if (enrollmentData.student.status !== "ATIVO") {
      throw new BadRequestException(
        `Cannot reactivate enrollment: student ${enrollmentData.student.id} is not active.`,
      );
    }

    const warnings: EnrollmentWarningDTO[] = [];
    if (enrollment.isActive()) {
      warnings.push({
        code: "ALREADY_ACTIVE",
        message: "Matrícula já estava ativa.",
      });

      return {
        id: enrollment.getId()!,
        student: {
          id: enrollmentData.student.id,
          fullName: enrollmentData.student.fullName,
          status: enrollmentData.student.status,
        },
        class: {
          id: enrollmentData.class.id,
          name: enrollmentData.class.name,
        },
        enrollmentDate: enrollment.getEnrollmentDate().toISOString().split("T")[0],
        endDate: null,
        warnings,
      };
    }
    const existingActive =
      await this.enrollmentRepository.findActiveByStudentAndClass(
        enrollment.getStudentId(),
        enrollment.getClassId(),
      );

    if (existingActive && existingActive.getId() !== id) {
      throw new ConflictException(
        `Student ${enrollment.getStudentId()} already has an active enrollment in class ${enrollment.getClassId()}.`,
      );
    }
    
    enrollment.reactivate();
    const updated = await this.enrollmentRepository.update(enrollment);

    return {
      id: updated.getId()!,
      student: {
        id: enrollmentData.student.id,
        fullName: enrollmentData.student.fullName,
        status: enrollmentData.student.status,
      },
      class: {
        id: enrollmentData.class.id,
        name: enrollmentData.class.name,
      },
      enrollmentDate: updated.getEnrollmentDate().toISOString().split("T")[0],
      endDate: null,
      warnings,
    };
  }

  async softDeleteEnrollment(id: number): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found.`);
    }

    if (!enrollment.isActive()) {
      throw new BadRequestException(
        `Enrollment with ID ${id} is already inactive.`,
      );
    }

    await this.enrollmentRepository.softDelete(id);
  }
}
