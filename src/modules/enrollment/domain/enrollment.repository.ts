import { Enrollment } from "./enrollment.entity";

export const ENROLLMENT_REPOSITORY_TOKEN = "IEnrollmentRepository";

export interface IEnrollmentRepository {
  create(enrollment: Enrollment): Promise<Enrollment>;
  createMany(enrollments: Enrollment[]): Promise<Enrollment[]>;
  findById(id: number): Promise<Enrollment | null>;
  findActiveByStudentAndClass(studentId: number, classId: number): Promise<Enrollment | null>;
  update(enrollment: Enrollment): Promise<Enrollment>;
  softDelete(id: number): Promise<boolean>;
}
