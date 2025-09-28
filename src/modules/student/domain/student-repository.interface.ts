import { Student } from "./student.entity";

export const STUDENT_REPOSITORY_TOKEN = "StudentRepository";

export interface IStudentRepository {
    create(student: Student): Promise<Student>;
    findByRegistrationNumber(registrationNumber: string): Promise<Student | null>;
    findById(id: number): Promise<Student | null>;
    findManyById(ids: number[]): Promise<Student[]>;
    findAll(): Promise<Student[]>;
    update(student: Student): Promise<Student>;
    delete(id: number): Promise<void>;
}
