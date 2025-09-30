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
            addressId: prismaFamilyMember.addressId,
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
            dateOfBirth: familyMember.getDateOfBirth(),
            registrationNumber: familyMember.getRegistrationNumber(),
            addressId: familyMember.getAddressId() ?? null,
            email: familyMember.getEmail() ?? null,
            socialName: familyMember.getSocialName() ?? null,
            race: familyMember.getRace() ?? null,
            gender: familyMember.getGender() ?? null,
            educationLevel: familyMember.getEducationLevel() ?? null,
            socialPrograms: familyMember.getSocialPrograms() ?? null,
            employmentStatus: familyMember.getEmploymentStatus() ?? null,
            nis: familyMember.getNis() ?? null,
        };
    }
}