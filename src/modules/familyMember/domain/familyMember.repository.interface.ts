import { FamilyMemberEntity } from './familyMember.entity';

export const FAMILY_MEMBER_REPOSITORY_TOKEN = "FamilyMemberRepository";

export interface IFamilyMemberRepository {
    findById(id: string): Promise<FamilyMemberEntity | null>;
    findAllByStudentId(studentId: string): Promise<FamilyMemberEntity[]>;
    create(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity>;
    update(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity>;
    delete(id: string): Promise<void>;
}