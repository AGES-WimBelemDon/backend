import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { IFamilyMemberRepository } from "../domain/familyMember.repository.interface";
import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { FamilyMemberMapper } from "./familyMember.mapper";

@Injectable()
export class PrismaFamilyMemberRepository implements IFamilyMemberRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity> {
        const addressId = familyMember.getAddressId();
        const studentIds = familyMember.getStudentIds();

        const data: Prisma.FamilyMemberCreateInput = {
            fullName: familyMember.getFullName(),
            relationship: familyMember.getRelationship(),
            phoneNumber: familyMember.getPhoneNumber(),
            email: familyMember.getEmail(),
            socialName: familyMember.getSocialName(),
            race: familyMember.getRace(),
            gender: familyMember.getGender(),
            educationLevel: familyMember.getEducationLevel(),
            dateOfBirth: familyMember.getDateOfBirth(),
            socialPrograms: familyMember.getSocialPrograms(),
            nis: familyMember.getNis(),
            registrationNumber: familyMember.getRegistrationNumber(),
            employmentStatus: familyMember.getEmploymentStatus(),
            student: { connect: studentIds.map(id => ({ id })) }
        };

        if (addressId) {
            data.address = { connect: { id: addressId } };
        }

        const newFamilyMember = await this.prisma.familyMember.create({
            data,
            include: { student: true, address: true }
        });

        return FamilyMemberMapper.toDomain(newFamilyMember);
    }

    async update(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity> {
        const id = familyMember.getId();
        
        const updatedFamilyMember = await this.prisma.familyMember.update({
            where: { id },
            data: {
                fullName: familyMember.getFullName(),
                relationship: familyMember.getRelationship(),
                phoneNumber: familyMember.getPhoneNumber(),
                email: familyMember.getEmail(),
                socialName: familyMember.getSocialName(),
                race: familyMember.getRace(),
                gender: familyMember.getGender(),
                educationLevel: familyMember.getEducationLevel(),
                dateOfBirth: familyMember.getDateOfBirth(),
                socialPrograms: familyMember.getSocialPrograms(),
                employmentStatus: familyMember.getEmploymentStatus(),
            },
            include: { student: true, address: true }
        });

        return FamilyMemberMapper.toDomain(updatedFamilyMember);
    }

    async findById(id: number): Promise<FamilyMemberEntity | null> {
        const familyMember = await this.prisma.familyMember.findUnique({
            where: { id },
            include: { student: true, address: true }
        });
        return familyMember ? FamilyMemberMapper.toDomain(familyMember) : null;
    }

    async findByEmail(email: string): Promise<FamilyMemberEntity | null> {
        if (!email) return null;
        const familyMember = await this.prisma.familyMember.findFirst({
            where: { email },
            include: { student: true, address: true }
        });
        return familyMember ? FamilyMemberMapper.toDomain(familyMember) : null;
    }

    async findAllByStudentId(studentId: number): Promise<FamilyMemberEntity[]> {
        const familyMembers = await this.prisma.familyMember.findMany({
            where: { student: { some: { id: studentId } } },
            include: { student: true, address: true }
        });
        return familyMembers.map(FamilyMemberMapper.toDomain);
    }

    async findByRegistrationNumber(registrationNumber: string): Promise<FamilyMemberEntity | null> {
        if (!registrationNumber) return null;
        const familyMember = await this.prisma.familyMember.findFirst({
            where: { registrationNumber },
            include: { student: true, address: true }
        });
        return familyMember ? FamilyMemberMapper.toDomain(familyMember) : null;
    }
    
    async delete(id: number): Promise<void> {
        await this.prisma.familyMember.delete({ where: { id } });
    } 
}