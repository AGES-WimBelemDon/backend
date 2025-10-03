import { Student as PrismaStudent } from "@prisma/client";
import { Student } from "../domain/student.entity";
import { StudentResponseDTO } from "../application/student.response.dto";

export class StudentMapper {
    static toDomain(prismaStudent: PrismaStudent): Student {
        return new Student({
            id: prismaStudent.id,
            fullName: prismaStudent.fullName,
            registrationNumber: prismaStudent.registrationNumber,
            dateOfBirth: prismaStudent.dateOfBirth || undefined,
            socialName: prismaStudent.socialName || undefined,
            addressId: prismaStudent.addressId || undefined,
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

    static toResponse(student: Student): StudentResponseDTO  {
    return {
        id: student.getId() ?? -1,
        fullName: student.getFullName(),
        registrationNumber: student.getRegistrationNumber(),
        dateOfBirth: student.getDateOfBirth() ?? null,
        enrollmentDate: student.getEnrollmentDate(),
        disenrollmentDate: student.getDisenrollmentDate() ?? null,
        status: student.getStatus(),
        addressId: student.getAddressId() || null,
        socialName: student.getSocialName() || null,
        race: student.getRace() || null,
        gender: student.getGender() || null,
        levelId: student.getLevelId() || null,
        schoolName: student.getSchoolName() || null,
        schoolShift: student.getSchoolShift() || null,
        schoolYear: student.getSchoolYear() || null,
        gradeGap: student.getGradeGap() || null,
        socialPrograms: student.getSocialPrograms() || null,
        employmentStatus: student.getEmploymentStatus() || null
    };
}
}
