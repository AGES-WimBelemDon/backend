import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { FamilyMember as PrismaFamilyMember } from "@prisma/client";
export class familyMemberMapper {
    static toDomain(prismaFamilyMember: PrismaFamilyMember): FamilyMemberEntity {
        return new FamilyMemberEntity({
            id: prismaFamilyMember.id,
            fullName: prismaFamilyMember.fullName,
            relationship: prismaFamilyMember.relationship,
            phoneNumber: prismaFamilyMember.phoneNumber,
            email: prismaFamilyMember.email || undefined,
            socialName: prismaFamilyMember.socialName || undefined,
            race: prismaFamilyMember.race || undefined,
            gender: prismaFamilyMember.gender || undefined,
            educationLevel: prismaFamilyMember.educationLevel || undefined,
            dateOfBirth: prismaFamilyMember.dateOfBirth || undefined,
            socialPrograms: prismaFamilyMember.socialPrograms || undefined,
            employmentStatus: prismaFamilyMember.employmentStatus || undefined,
            studentId: prismaFamilyMember.studentId,
            addressId: prismaFamilyMember.addressId
        });
    }

    static toPrisma(familyMember: FamilyMemberEntity): Omit<PrismaFamilyMember, 'id' | 'addressId' | 'studentId' | 'fullName' | 'relationship' | 'phoneNumber' | 'email' | 'socialName' | 'race' | 'gender' | 'educationLevel' | 'dateOfBirth' | 'socialPrograms' | 'employmentStatus'> {
        return {
            id: familyMember.getId(),
            fullName: familyMember.getFullName(),
            relationship: familyMember.getRelationship(),
            phoneNumber: familyMember.getPhoneNumber(),
            email: familyMember.getEmail() || null,
            socialName: familyMember.getSocialName() || null,
            race: familyMember.getRace() || null,
            gender: familyMember.getGender() || null,
            educationLevel: familyMember.getEducationLevel() || null,
            dateOfBirth: familyMember.getDateOfBirth() || null,
            socialPrograms: familyMember.getSocialPrograms() || null,
            employmentStatus: familyMember.getEmploymentStatus() || null,
            studentId: familyMember.getStudentId(),
            addressId: familyMember.getAddressId()
        }
    }


    static toPersistence(familyMember: FamilyMemberEntity) {
        return {
            id: familyMember.getId(),
            fullname: familyMember.getFullName(),
            relationship: familyMember.getRelationship(),
            phone_number: familyMember.getPhoneNumber(),
            email: familyMember.getEmail(),
            social_name: familyMember.getSocialName(),
            race: familyMember.getRace(),
            gender: familyMember.getGender(),
            EducationLevel: familyMember.getEducationLevel(),
            date_of_birth: familyMember.getDateOfBirth(),
            social_programs: familyMember.getSocialPrograms(),
            employment_status: familyMember.getEmploymentStatus(),
            student_id: familyMember.getStudentId(),
            address_id: familyMember.getAddressId()
        };
    }
}