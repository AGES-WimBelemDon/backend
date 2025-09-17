import { Student as PrismaStudent } from "@prisma/client";
import { Student } from "../domain/student.entity";

export class StudentMapper {
    static toDomain(prismaStudent: PrismaStudent): Student {
        return new Student({
            id: prismaStudent.id,
            fullName: prismaStudent.fullName,
            registrationNumber: prismaStudent.registrationNumber,
            dateOfBirth: prismaStudent.dateOfBirth || undefined,
            socialName: prismaStudent.socialName || undefined,
        });
    }

    static toPrisma(student: Student): Omit<PrismaStudent, 'id' | 'addressId' | 'enrollmentDate' | 'disenrollmentDate' | 'status' | 'levelId' | 'race' | 'schoolName' | 'schoolShift' | 'schoolYear' | 'socialPrograms' | 'gender' | 'employmentStatus' | 'gradeGap'> {
        return {
            fullName: student.getFullName(),
            registrationNumber: student.getRegistrationNumber(),
            dateOfBirth: student.getDateOfBirth() || null,
            socialName: student.getSocialName() || null,
        };
    }

    static toResponse(student: Student) {
        return {
            id: student.getId(),
            fullName: student.getFullName(),
            registrationNumber: student.getRegistrationNumber(),
            dateOfBirth: student.getDateOfBirth(),
            socialName: student.getSocialName(),
            enrollmentDate: student.getEnrollmentDate(),
            status: student.getStatus(),
        };
    }
}
