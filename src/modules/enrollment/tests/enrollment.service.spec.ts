import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { EnrollmentService } from "../application/enrollment.service";
import { IEnrollmentRepository } from "../domain/enrollment.repository";
import {
  ENROLLMENT_QUERIES_TOKEN,
  IEnrollmentQueries,
} from "../application/enrollment.service.query.interfaces";
import { Enrollment } from "../domain/enrollment.entity";
import { StudentService } from "src/modules/student/application/student.service";
import { Student } from "src/modules/student/domain/student.entity";
import { StudentStatus } from "src/common/enums/domain.enums";

const makeStudent = (id: number, overrides: Partial<Student> = {}) =>
  new Student({
    id,
    fullName: `Student ${id}`,
    registrationNumber: `0000000000${id}`,
    status: overrides["status"] ?? StudentStatus.ATIVO,
  });

const makeEnrollment = (
  overrides: Partial<ConstructorParameters<typeof Enrollment>[0]> = {},
) =>
  new Enrollment({
    id: overrides.id ?? 1,
    studentId: overrides.studentId ?? 1,
    classId: overrides.classId ?? 1,
    enrollmentDate: overrides.enrollmentDate ?? new Date("2024-01-01"),
    endDate: overrides.endDate ?? null,
  });

describe("EnrollmentService", () => {
  let repository: jest.Mocked<IEnrollmentRepository>;
  let queries: jest.Mocked<IEnrollmentQueries>;
  let studentService: jest.Mocked<StudentService>;
  let service: EnrollmentService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      createMany: jest.fn(),
      findById: jest.fn(),
      findActiveByStudentAndClass: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };
    queries = {
      findEnrollments: jest.fn(),
      findEnrollmentWithStudentAndClass: jest.fn(),
    };
    studentService = {
      findManyById: jest.fn(),
    } as unknown as jest.Mocked<StudentService>;

    service = new EnrollmentService(
      repository as unknown as IEnrollmentRepository,
      queries as unknown as IEnrollmentQueries,
      studentService as unknown as StudentService,
    );
  });

  it("should throw when some students are missing", async () => {
    studentService.findManyById.mockResolvedValue([makeStudent(1)]);

    await expect(
      service.createEnrollments({ classId: 1, studentIds: [1, 2] }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should create enrollments and generate warnings for already active ones", async () => {
    const students = [makeStudent(1), makeStudent(2)];
    studentService.findManyById.mockResolvedValue(students);
    repository.findActiveByStudentAndClass
      .mockResolvedValueOnce(makeEnrollment({ studentId: 1 }))
      .mockResolvedValueOnce(null);
    const createdEnrollment = makeEnrollment({ id: 10, studentId: 2 });
    repository.create.mockResolvedValue(createdEnrollment);

    const result = await service.createEnrollments({
      classId: 3,
      studentIds: [1, 2],
    });

    expect(result.warnings).toHaveLength(1);
    expect(result.created).toHaveLength(1);
  });

  it("should throw when enrollment is not found during reactivation", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.reactivateEnrollment(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should throw when enrollment data cannot be loaded", async () => {
    repository.findById.mockResolvedValue(makeEnrollment());
    queries.findEnrollmentWithStudentAndClass.mockResolvedValue(null);

    await expect(service.reactivateEnrollment(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should prevent reactivation when student is not active", async () => {
    repository.findById.mockResolvedValue(makeEnrollment());
    queries.findEnrollmentWithStudentAndClass.mockResolvedValue({
      student: { id: 1, fullName: "Test", status: "INATIVO" },
      class: { id: 1, name: "Class" },
    } as any);

    await expect(service.reactivateEnrollment(1)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("should return warning when enrollment already active", async () => {
    const enrollment = makeEnrollment({ endDate: null });
    repository.findById.mockResolvedValue(enrollment);
    queries.findEnrollmentWithStudentAndClass.mockResolvedValue({
      student: { id: 1, fullName: "Test", status: "ATIVO" },
      class: { id: 2, name: "Music" },
    } as any);

    const result = await service.reactivateEnrollment(1);

    expect(result.warnings).toHaveLength(1);
  });

  it("should throw conflict when another active enrollment exists", async () => {
    const enrollment = makeEnrollment({ id: 1, endDate: new Date("2024-01-02") });
    repository.findById.mockResolvedValue(enrollment);
    queries.findEnrollmentWithStudentAndClass.mockResolvedValue({
      student: { id: 1, fullName: "Test", status: "ATIVO" },
      class: { id: 1, name: "Class" },
    } as any);
    repository.findActiveByStudentAndClass.mockResolvedValue(
      makeEnrollment({ id: 2 }),
    );

    await expect(service.reactivateEnrollment(1)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("should reactivate enrollment and return updated data", async () => {
    const enrollment = makeEnrollment({ id: 1, endDate: new Date("2024-01-02") });
    repository.findById.mockResolvedValue(enrollment);
    queries.findEnrollmentWithStudentAndClass.mockResolvedValue({
      student: { id: 1, fullName: "Test", status: "ATIVO" },
      class: { id: 1, name: "Class" },
    } as any);
    repository.findActiveByStudentAndClass.mockResolvedValue(null);
    repository.update.mockResolvedValue(enrollment);

    const result = await service.reactivateEnrollment(1);

    expect(repository.update).toHaveBeenCalledWith(enrollment);
    expect(result.endDate).toBeNull();
  });

  it("should throw when deleting non existent enrollment", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.softDeleteEnrollment(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should throw when deleting already inactive enrollment", async () => {
    const enrollment = makeEnrollment({ endDate: new Date() });
    repository.findById.mockResolvedValue(enrollment);

    await expect(service.softDeleteEnrollment(1)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("should soft delete active enrollment", async () => {
    const enrollment = makeEnrollment({ endDate: null });
    repository.findById.mockResolvedValue(enrollment);
    repository.softDelete.mockResolvedValue(true);

    await service.softDeleteEnrollment(1);

    expect(repository.softDelete).toHaveBeenCalledWith(1);
  });

  it("should finish enrollments by class id", async () => {
    queries.findEnrollments.mockResolvedValue([
      { enrollmentId: 1 } as any,
      { enrollmentId: 2 } as any,
    ]);
    repository.findById
      .mockResolvedValueOnce(makeEnrollment({ id: 1 }))
      .mockResolvedValueOnce(
        makeEnrollment({ id: 2, endDate: new Date("2024-01-05") }),
      );

    await service.finishEnrollmentsByClassId(3, new Date("2024-02-01"));

    expect(repository.update).toHaveBeenCalledTimes(1);
  });
});

