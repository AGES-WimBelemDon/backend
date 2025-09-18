import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FAMILY_MEMBER_REPOSITORY_TOKEN, IFamilyMemberRepository } from "../domain/familyMember.repository.interface";
import { CreateFamilyMemberDTO } from "./createFamilyMember.dto";
import { UpdateFamilyMemberDTO } from "./updateFamilyMember.dto";
import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FamilyMemberService {
    constructor(
        @Inject(FAMILY_MEMBER_REPOSITORY_TOKEN)
        private readonly familyMemberRepository: IFamilyMemberRepository,
        private readonly prisma: PrismaService,
    ) {}

    async create(dto: CreateFamilyMemberDTO): Promise<FamilyMemberEntity> {
        if (dto.email) {
            const existingMember = await this.familyMemberRepository.findByEmail(dto.email);
            if (existingMember) {
                throw new ConflictException(`O e-mail '${dto.email}' já está em uso.`);
            }
        }
        
        await this.validateDependencies(dto.addressId, dto.studentIds);

        let dateOfBirth: Date | undefined;
        if (dto.dateOfBirth) {
            dateOfBirth = new Date(dto.dateOfBirth);
            if (isNaN(dateOfBirth.getTime())) {
                throw new BadRequestException("Data de nascimento inválida");
            }
            if (dateOfBirth > new Date()) {
                throw new BadRequestException("Data de nascimento não pode ser futura");
            }
        }
        
        const familyMemberEntity = new FamilyMemberEntity({ ...dto, dateOfBirth });

        return this.familyMemberRepository.create(familyMemberEntity);
    }

    async update(id: number, dto: UpdateFamilyMemberDTO): Promise<FamilyMemberEntity> {
        const existingFamilyMember = await this.familyMemberRepository.findById(id);
        if (!existingFamilyMember) {
            throw new NotFoundException(`Membro da família com ID ${id} não encontrado.`);
        }

        if (dto.email) {
            const memberWithSameEmail = await this.prisma.familyMember.findFirst({
                where: { email: dto.email, NOT: { id: id } },
            });
            if (memberWithSameEmail) {
                throw new ConflictException(`O e-mail '${dto.email}' já está em uso.`);
            }
        }
        
        const partialEntity = new FamilyMemberEntity({ id, ...existingFamilyMember, ...dto } as any);

        return this.familyMemberRepository.update(partialEntity);
    }

    async delete(id: number): Promise<void> {
        const existingFamilyMember = await this.familyMemberRepository.findById(id);
        if (!existingFamilyMember) {
            throw new NotFoundException(`Membro da família com ID ${id} não encontrado.`);
        }
        return this.familyMemberRepository.delete(id);
    }

    async findById(id: number): Promise<FamilyMemberEntity> {
        const familyMember = await this.familyMemberRepository.findById(id);
        if (!familyMember) {
            throw new NotFoundException(`Membro da família com ID ${id} não encontrado.`);
        }
        return familyMember;
    }

    async findByStudentId(studentId: number): Promise<FamilyMemberEntity[]> {
        return this.familyMemberRepository.findAllByStudentId(studentId);
    }

    private async validateDependencies(addressId: number | undefined, studentIds: number[]): Promise<void> {
        if (addressId) {
            const address = await this.prisma.address.findUnique({ where: { id: addressId } });
            if (!address) {
                throw new NotFoundException(`Endereço com ID ${addressId} não encontrado.`);
            }
        }
        const foundStudents = await this.prisma.student.findMany({ where: { id: { in: studentIds } } });
        if (foundStudents.length !== studentIds.length) {
            const notFoundIds = studentIds.filter(id => !foundStudents.some(s => s.id === id));
            throw new NotFoundException(`Estudante(s) com ID(s) ${notFoundIds.join(', ')} não encontrado(s).`);
        }
    }
}