import { FamilyMemberEntity } from './familyMember.entity';

export const FAMILY_MEMBER_REPOSITORY_TOKEN = "FamilyMemberRepository";

export interface IFamilyMemberRepository {
    create(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity>;
    delete(id: number): Promise<void>;
    findAllByStudentId(studentId: number): Promise<FamilyMemberEntity[]>;
    findByEmail(email: string): Promise<FamilyMemberEntity | null>;
    findById(id: number): Promise<FamilyMemberEntity | null>;
    findByRegistrationNumber(registrationNumber: string): Promise<FamilyMemberEntity | null>;
    update(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity>;
}