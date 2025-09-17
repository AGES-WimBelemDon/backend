import { Injectable } from "@nestjs/common";
import { IFamilyMemberRepository } from "../domain/familyMember.repository.interface";
import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { FamilyMember, Prisma } from "@prisma/client";
import { StudentRepository } from "src/modules/student/infrastructure/student.repository";
import { familyMemberMapper } from "./familyMember.mapper";


@Injectable()
export class PrismaFamilyMemberRepository implements IFamilyMemberRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity> {
        const newFamilyMember = await this.prisma.familyMember.create({
            data: {
                fullName: familyMember.getFullName(),
                phoneNumber: familyMember.getPhoneNumber(),
                relationship: familyMember.getRelationship(),
                email: familyMember.getEmail(),
                socialName: familyMember.getSocialName(),
                race: familyMember.getRace(),
                gender: familyMember.getGender(),
                educationLevel: familyMember.getEducationLevel(),
                dateOfBirth: familyMember.getDateOfBirth() || null,
                socialPrograms: familyMember.getSocialPrograms(),
                employmentStatus: familyMember.getEmploymentStatus(),
                address: familyMember.getAddress(),
                student: familyMember.getStudents()
            },
        })
        return familyMemberMapper.toDomain(newFamilyMember);
    }
    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllByStudentId(studentId: number): Promise<FamilyMemberEntity[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<FamilyMemberEntity | null> {
        throw new Error("Method not implemented.");
    }
    update(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity> {
        throw new Error("Method not implemented.");
    }

}