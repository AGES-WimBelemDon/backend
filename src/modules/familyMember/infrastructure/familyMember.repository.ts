import { Injectable } from "@nestjs/common";
import { IFamilyMemberRepository } from "../domain/familyMember.repository.interface";
import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class PrismaFamilyMemberRepository implements IFamilyMemberRepository {
    constructor(private readonly prisma: PrismaService) { }
    create(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity> {
        //if ()
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllByStudentId(studentId: string): Promise<FamilyMemberEntity[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<FamilyMemberEntity | null> {
        throw new Error("Method not implemented.");
    }
    update(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity> {
        throw new Error("Method not implemented.");
    }
}