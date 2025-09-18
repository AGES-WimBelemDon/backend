import { Injectable, NotFoundException } from "@nestjs/common";
import { IFamilyMemberRepository } from "../domain/familyMember.repository.interface";
import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { FamilyMemberMapper } from "./familyMember.mapper";
import { Prisma } from "@prisma/client";
import { UpdateFamilyMemberDTO } from "../application/updateFamilyMember.dto";



@Injectable()
export class PrismaFamilyMemberRepository implements IFamilyMemberRepository {
    constructor(private readonly prisma: PrismaService) { }

    async update(familyMember: FamilyMemberEntity): Promise<FamilyMemberEntity> {
        const id = familyMember.getId();
        const existingFamilyMember = await this.prisma.familyMember.findUnique({ where: { id } });
        if (!existingFamilyMember) {
            throw new NotFoundException(`Membro da família com ID ${id} não encontrado.`);
        }

        // (Opcional) Adicione aqui outras regras de negócio, como verificar se um novo e-mail já existe.

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
            include: {
                student: true,
                address: true,
            }
        });

        return FamilyMemberMapper.toDomain(updatedFamilyMember);
    }

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
            employmentStatus: familyMember.getEmploymentStatus(),
            student: {
                connect: studentIds.map(id => ({ id }))
            }
        };

        if (addressId) {
            data.address = {
                connect: { id: addressId }
            };
        }

        const newFamilyMember = await this.prisma.familyMember.create({
            data,
            include: {
                student: true,
                address: true,
            }
        });

        return FamilyMemberMapper.toDomain(newFamilyMember);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.familyMember.delete({ where: { id } });
    } 
    
    async findAllByStudentId(studentId: number): Promise<FamilyMemberEntity[]> {
        const familyMembers = await this.prisma.familyMember.findMany({
            where: {
                student: {
                    some: { id: studentId }
                }
            },
            include: { student: true }
        });
        return familyMembers.map(FamilyMemberMapper.toDomain);
    }

    async findById(id: number): Promise<FamilyMemberEntity | null> {
        const familyMember = await this.prisma.familyMember.findUnique({
            where: { id },
            include: { student: true }
        });
        return familyMember ? FamilyMemberMapper.toDomain(familyMember) : null;
    }

    async findByEmail(email: string): Promise<FamilyMemberEntity | null> {
        const familyMember = await this.prisma.familyMember.findFirst({
            where: { email },
            include: { student: true }
        });
        return familyMember ? FamilyMemberMapper.toDomain(familyMember) : null;
    }
}