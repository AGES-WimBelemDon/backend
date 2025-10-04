import { Student as PrismaStudent } from "@prisma/client";
import { Student } from "../domain/student.entity";
import { StudentResponseDTO } from "../application/student.response.dto";
import { transformDateToISODateString } from "src/common/utils/type.transformation.functions";

export class StudentMapper {
    static toDomain(prismaStudent: PrismaStudent): Student {
        return new Student({
            ...prismaStudent
        });
    }

    static toResponse(student: Student): StudentResponseDTO  {
    return {
        id: student.getId() ?? -1,
        fullName: student.getFullName(),
        registrationNumber: student.getRegistrationNumber(),
        dateOfBirth: transformDateToISODateString(student.getDateOfBirth()),
        enrollmentDate: transformDateToISODateString(student.getEnrollmentDate()),
        disenrollmentDate: transformDateToISODateString(student.getDisenrollmentDate()),
        status: student.getStatus(),
        addressId: student.getAddressId() ?? null,
        socialName: student.getSocialName() ?? null,
        race: student.getRace() ?? null,
        gender: student.getGender() ?? null,
        levelId: student.getLevelId() ?? null,
        schoolName: student.getSchoolName() ?? null,
        schoolShift: student.getSchoolShift() ?? null,
        schoolYear: student.getSchoolYear() ?? null,
        gradeGap: student.getGradeGap() ?? null,
        socialPrograms: student.getSocialPrograms() ?? null,
        employmentStatus: student.getEmploymentStatus() ?? null
    };
}
}
