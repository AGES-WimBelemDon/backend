import { FirebaseService } from "src/modules/firebase/application/firebase.service";
import { FAMILY_MEMBER_REPOSITORY_TOKEN, IFamilyMemberRepository } from "../domain/familyMember.repository.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FamilyMemberService {
    @Inject(FAMILY_MEMBER_REPOSITORY_TOKEN)
    private readonly familyMemberRepository: IFamilyMemberRepository;
    @Inject(FirebaseService)
    private readonly firebaseAdminService: FirebaseService;
    async create(familyMemberDto: any): Promise<any> {
    }
    async boundStudent(familyMemberId: string, studentId: string): Promise<void> { }

}