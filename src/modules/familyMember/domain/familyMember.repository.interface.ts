import { FamilyMemberEntity } from './familyMember.entity';

export const FAMILY_MEMBER_REPOSITORY_TOKEN = "FamilyMemberRepository";

export interface IFamilyMemberRepository {
    create(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity>;
    delete(id: number): Promise<void>;
    findAllByStudentId(studentId: number): Promise<FamilyMemberEntity[]>;
    findById(id: string): Promise<FamilyMemberEntity | null>;
    update(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity>;
}