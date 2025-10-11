import { Answer, Class, Doc, Enrollment, FamilyMember, Frequency, Student as PrismaStudent } from "@prisma/client";
import { Student } from "../domain/student.entity";
import { StudentResponseDTO } from "../application/student.response.dto";
import { transformDateToISODateString } from "src/common/utils/type.transformation.functions";

type PrismaStudentWithRelations = PrismaStudent & {
  family?: FamilyMember[];
  frequencies?: Frequency[];
  answers?: Answer[];
  docs?: Doc[];
  classes?: Enrollment[];
};


export class StudentMapper {
    static toDomain(prismaStudent: PrismaStudentWithRelations): Student {
        return new Student({
            id: prismaStudent.id,
            fullName: prismaStudent.fullName,
            registrationNumber: prismaStudent.registrationNumber,
            dateOfBirth: prismaStudent.dateOfBirth,
            enrollmentDate: prismaStudent.enrollmentDate,
            disenrollmentDate: prismaStudent.disenrollmentDate,
            status: prismaStudent.status,
            addressId: prismaStudent.addressId,
            socialName: prismaStudent.socialName,
            race: prismaStudent.race,
            gender: prismaStudent.gender,
            levelId: prismaStudent.levelId,
            schoolName: prismaStudent.schoolName,
            schoolShift: prismaStudent.schoolShift,
            schoolYear: prismaStudent.schoolYear,
            gradeGap: prismaStudent.gradeGap,
            socialPrograms: prismaStudent.socialPrograms,
            employmentStatus: prismaStudent.employmentStatus,
            familyMembersId: prismaStudent.family?.map(f => f.id) || [],
            frequenciesId: prismaStudent.frequencies?.map(f => f.id) || [],
            answersId: prismaStudent.answers?.map(f => f.id) || [],
            classesId: prismaStudent.classes?.map(f => f.id) || []
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
        employmentStatus: student.getEmploymentStatus() ?? null,
        familyMembersId: student.getFamilyMembersId() ?? [],
        frequenciesId: student.getFrequenciesId() ?? [],
        answersId: student.getAnswers() ?? [],
        classesId: student.getClassesId() ?? []
    };
}
}
