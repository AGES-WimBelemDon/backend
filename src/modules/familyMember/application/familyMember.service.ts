import { 
    BadRequestException,
    ConflictException, 
    Inject, 
    Injectable, 
    NotFoundException 
} from "@nestjs/common";
import {
    FAMILY_MEMBER_REPOSITORY_TOKEN,
    IFamilyMemberRepository 
} from "../domain/familyMember.repository.interface";
import { CreateFamilyMemberDTO } from "./createFamilyMember.dto";
import { UpdateFamilyMemberDTO } from "./updateFamilyMember.dto";
import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { IStudentRepository, STUDENT_REPOSITORY_TOKEN } from "src/modules/student/domain/student-repository.interface";

@Injectable()
export class FamilyMemberService {
    constructor(
        @Inject(FAMILY_MEMBER_REPOSITORY_TOKEN)
        private readonly familyMemberRepository: IFamilyMemberRepository,

        @Inject(STUDENT_REPOSITORY_TOKEN)
        private readonly studentRepository: IStudentRepository,
    ) {}

    async create(dto: CreateFamilyMemberDTO): Promise<FamilyMemberEntity> {
        if (!CreateFamilyMemberDTO.validateCPF(dto.registrationNumber)) {
            throw new BadRequestException("Invalid CPF");
        }

        const existingByReg = await this.familyMemberRepository.findByRegistrationNumber(dto.registrationNumber);
        if (existingByReg) {
            throw new ConflictException(`CPF '${dto.registrationNumber}' already in use!`);
        }

        if (dto.email) {
            const existingMember = await this.familyMemberRepository.findByEmail(dto.email);
            if (existingMember) {
                throw new ConflictException(`Email '${dto.email}' already in use!`);
            }
        }
        
        if (dto.addressId !== undefined) {
            await this.validateAddressById(dto.addressId);
        }
        await this.validateStudentsById(dto.studentIds);

        const dateOfBirth = new Date(dto.dateOfBirth);
        
        if (isNaN(dateOfBirth.getTime())) {
            throw new BadRequestException("Data de nascimento inválida");
        }

        if (dateOfBirth > new Date()) {
            throw new BadRequestException("Data de nascimento não pode ser futura");
        }
        
        const familyMemberEntity = new FamilyMemberEntity({ ...dto, dateOfBirth });

        return this.familyMemberRepository.create(familyMemberEntity);
    }

    async update(id: number, dto: UpdateFamilyMemberDTO): Promise<FamilyMemberEntity> {
        const existingFamilyMember = await this.familyMemberRepository.findById(id);
        if (!existingFamilyMember) {
            throw new NotFoundException(`Family member with ID ${id} not found.`);
        }

        if (dto.email) {
            const emailOwner = await this.familyMemberRepository.findByEmail(dto.email);
            if (emailOwner && emailOwner.getId() !== id) {
                throw new ConflictException(`Email '${dto.email}' already in use!`);
            }
        }
        
        const partialEntity = new FamilyMemberEntity({ id, ...existingFamilyMember, ...dto } as any);

        return this.familyMemberRepository.update(partialEntity);
    }

    async delete(id: number): Promise<void> {
        const existingFamilyMember = await this.familyMemberRepository.findById(id);
        if (!existingFamilyMember) {
            throw new NotFoundException(`Family member with ID ${id} not found.`);
        }
        return this.familyMemberRepository.delete(id);
    }

    async findById(id: number): Promise<FamilyMemberEntity> {
        const familyMember = await this.familyMemberRepository.findById(id);
        if (!familyMember) {
            throw new NotFoundException(`Family member with ID ${id} not found.`);
        }
        return familyMember;
    }

    async findByStudentId(studentId: number): Promise<FamilyMemberEntity[]> {
        return this.familyMemberRepository.findAllByStudentId(studentId);
    }

    private async validateAddressById(addressId: number): Promise<void> {
        //TODO: Uncomment when Address module is done
        //const address = await this.prisma.address.findUnique({ where: { id: addressId } });
        //if (!address) {
       //     throw new NotFoundException(`Address with ID ${addressId} not found.`);
        //}

        //Temporary: Log for tracking
        console.warn("Adress validation skipped for ID ${addressId}. Implement when Address module is done.");
    }

    private async validateStudentsById(studentIds: number[]): Promise<void> {
        const foundStudents = await this.studentRepository.findManyById(studentIds);
        const foundIds = foundStudents.map(s => s.id);
        const notFoundIds = studentIds.filter(id => !foundIds.includes(id));
        if (notFoundIds.length > 0) {
            throw new NotFoundException(`Students with IDs ${notFoundIds.join(", ")} not found.`);
        }
    }
}