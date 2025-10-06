import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IStudentRepository } from "../domain/student-repository.interface";
import { Student } from "../domain/student.entity";
import { StudentMapper } from "./student.mapper";

@Injectable()
export class StudentRepository implements IStudentRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(student: Student): Promise<Student> {
        const prismaStudent = await this.prisma.student.create({
            data: {
                fullName: student.getFullName(),
                registrationNumber: student.getRegistrationNumber(),
                dateOfBirth: student.getDateOfBirth() || null,
                socialName: student.getSocialName() || null,
                enrollmentDate: student.getEnrollmentDate(),
                status: 'ATIVO' as any,
            },
        });

        return StudentMapper.toDomain(prismaStudent);
    }

    async findByRegistrationNumber(registrationNumber: string): Promise<Student | null> {
        const prismaStudent = await this.prisma.student.findUnique({
            where: { registrationNumber },
        });

        if (!prismaStudent) {
            return null;
        }

        return StudentMapper.toDomain(prismaStudent);
    }

    async findById(id: number): Promise<Student | null> {
        const prismaStudent = await this.prisma.student.findUnique({
            where: { id },
        });

        if (!prismaStudent) {
            return null;
        }

        return StudentMapper.toDomain(prismaStudent);
    }

    async findManyById(ids: number[]): Promise<Student[]> {
        const prismaStudents = await this.prisma.student.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        return prismaStudents.map(StudentMapper.toDomain);
    }

    async findAll(): Promise<Student[]> {
        const prismaStudents = await this.prisma.student.findMany({
            where: { status: 'ATIVO' },
            orderBy: { enrollmentDate: 'desc' },
        });

        return prismaStudents.map(StudentMapper.toDomain);
    }

    async update(student: Student ): Promise<Student> {
        const id = student.getId();
        const prismaStudent = await this.prisma.student.update({
            where: { id },
            data: {
                fullName: student.getFullName(),
                socialName: student.getSocialName() || null,
                dateOfBirth: student.getDateOfBirth() || null,

                address: student.getAddressId() === null
                    ? { disconnect: true }
                    : typeof student.getAddressId() === "number"
                        ? { connect: { id: student.getAddressId() as number } }
                        : undefined,
            },
            include: {
                address: true,
            }
        });

        return StudentMapper.toDomain(prismaStudent);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.student.update({
            where: { id },
            data: { status: 'INATIVO' },
        });
    }
}
