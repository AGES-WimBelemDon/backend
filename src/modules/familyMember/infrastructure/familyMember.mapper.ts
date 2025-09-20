import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { FamilyMember as PrismaFamilyMember, Student } from "@prisma/client";

type PrismaFamilyMemberWithRelations = PrismaFamilyMember & {
    student?: Student[];
};

export class FamilyMemberMapper {
    static toDomain(prismaFamilyMember: PrismaFamilyMemberWithRelations): FamilyMemberEntity {
        return new FamilyMemberEntity({
            id: prismaFamilyMember.id,
            fullName: prismaFamilyMember.fullName,
            relationship: prismaFamilyMember.relationship,
            phoneNumber: prismaFamilyMember.phoneNumber,
            studentIds: prismaFamilyMember.student?.map(s => s.id) || [],
            addressId: prismaFamilyMember.addressId || undefined,
            email: prismaFamilyMember.email || undefined,
            socialName: prismaFamilyMember.socialName || undefined,
            race: prismaFamilyMember.race || undefined,
            gender: prismaFamilyMember.gender || undefined,
            educationLevel: prismaFamilyMember.educationLevel || undefined,
            dateOfBirth: prismaFamilyMember.dateOfBirth,
            socialPrograms: prismaFamilyMember.socialPrograms || undefined,
            employmentStatus: prismaFamilyMember.employmentStatus || undefined,
            nis: prismaFamilyMember.nis || undefined,
            registrationNumber: prismaFamilyMember.registrationNumber,
        });
    }

    static toResponse(familyMember: FamilyMemberEntity) {
        return {
            id: familyMember.getId(),
            fullName: familyMember.getFullName(),
            relationship: familyMember.getRelationship(),
            phoneNumber: familyMember.getPhoneNumber(),
            studentIds: familyMember.getStudentIds(),
            addressId: familyMember.getAddressId(),
            email: familyMember.getEmail(),
            socialName: familyMember.getSocialName(),
            race: familyMember.getRace(),
            gender: familyMember.getGender(),
            educationLevel: familyMember.getEducationLevel(),
            dateOfBirth: familyMember.getDateOfBirth(),
            socialPrograms: familyMember.getSocialPrograms(),
            employmentStatus: familyMember.getEmploymentStatus(),
            nis: familyMember.getNis(),
            registrationNumber: familyMember.getRegistrationNumber(),
        };
    }
}