import { 
    BadRequestException,
    ConflictException, 
    Inject, 
    Injectable, 
    NotFoundException 
} from "@nestjs/common";
import { FAMILY_MEMBER_REPOSITORY_TOKEN, IFamilyMemberRepository } from "../domain/familyMember.repository.interface";
import { CreateFamilyMemberDTO } from "./createFamilyMember.dto";
import { UpdateFamilyMemberDTO } from "./updateFamilyMember.dto";
import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { IStudentRepository, STUDENT_REPOSITORY_TOKEN } from "src/modules/student/domain/student-repository.interface";
import { AddressEntity } from "src/modules/address/domain/address.entity";
import { CreateAddressDTO } from "src/modules/address/application/create-address.dto";
import { AddressService } from "src/modules/address/application/address.service";

@Injectable()
export class FamilyMemberService {
    constructor(
        @Inject(FAMILY_MEMBER_REPOSITORY_TOKEN)
        private readonly familyMemberRepository: IFamilyMemberRepository,

        private readonly addressService: AddressService,

        @Inject(STUDENT_REPOSITORY_TOKEN)
        private readonly studentRepository: IStudentRepository,
    ) {}

    async create(dto: CreateFamilyMemberDTO): Promise<FamilyMemberEntity> {
        if (!CreateFamilyMemberDTO.validateCPF(dto.registrationNumber)) {
            throw new BadRequestException("Invalid CPF");
        }

        const existingByReg = await this.familyMemberRepository.findByRegistrationNumber(dto.registrationNumber);
        if (existingByReg) {
            throw new ConflictException(`CPF '${dto.registrationNumber}' is already in use.`);
        }

        if (dto.email) {
            const existingMember = await this.familyMemberRepository.findByEmail(dto.email);
            if (existingMember) {
                throw new ConflictException(`Email '${dto.email}' is already in use.`);
            }
        }
        
        if (dto.addressId !== undefined) {
            await this.validateAddressById(dto.addressId);
        }
        await this.validateStudentsById(dto.studentIds);

        if (dto.dateOfBirth > new Date()) {
            throw new BadRequestException("Date of birth cannot be in the future.");
        }
        
        const familyMemberEntity = new FamilyMemberEntity(dto);
        return this.familyMemberRepository.create(familyMemberEntity);
    }

    async update(id: number, dto: UpdateFamilyMemberDTO): Promise<FamilyMemberEntity> {
        const existingFamilyMember = await this.familyMemberRepository.findById(id);
        if (!existingFamilyMember) {
            throw new NotFoundException(`Family member with ID ${id} not found.`);
        }

        if (dto.registrationNumber) {
            const regOwner = await this.familyMemberRepository.findByRegistrationNumber(dto.registrationNumber);
            if (regOwner && regOwner.getId() !== id){
                throw new ConflictException(`CPF '${dto.registrationNumber}' is already in use.`);
            }
        }
        if (dto.email) {
            const emailOwner = await this.familyMemberRepository.findByEmail(dto.email);
            if (emailOwner && emailOwner.getId() !== id) {
                throw new ConflictException(`Email '${dto.email}' is already in use.`);
            }
        }
        
        Object.keys(dto).forEach(key => {
            const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
            if (typeof existingFamilyMember[setterName] === 'function') {
                existingFamilyMember[setterName](dto[key]);
            }
        });
        
        return this.familyMemberRepository.update(existingFamilyMember);
    }

    async addAddressToFamilyMember(familyMemberId: number, dto: CreateAddressDTO): Promise<AddressEntity> {
        const familyMember = await this.findById(familyMemberId);
        
        const newAddress = await this.addressService.create(dto);
        
        familyMember.setAddressId(newAddress.id);
        await this.familyMemberRepository.update(familyMember);
        
        return newAddress;
    }

    async getFamilyMemberAddress(familyMemberId: number): Promise<AddressEntity> {
        const familyMember = await this.findById(familyMemberId);
        const addressId = familyMember.getAddressId();

        if (!addressId) {
            throw new NotFoundException(`Family member with ID ${familyMemberId} does not have an address.`);
        }

        return this.addressService.findById(addressId);
    }

    async removeAddressFromFamilyMember(familyMemberId: number): Promise<void> {
        const familyMember = await this.findById(familyMemberId);
        const addressId = familyMember.getAddressId();

        if (addressId === null || addressId === undefined) {
            throw new NotFoundException(`Family member with ID ${familyMemberId} does not have an address to remove.`);
        }

        familyMember.setAddressId(null); 
        await this.familyMemberRepository.update(familyMember);
        await this.addressService.delete(addressId);
    }

    async delete(id: number): Promise<void> {
        await this.findById(id);
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
        const student = await this.studentRepository.findById(studentId);
        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found.`);
        }
        return this.familyMemberRepository.findAllByStudentId(studentId);
    }

    private async validateAddressById(addressId: number): Promise<void> {
        await this.addressService.findById(addressId);
    }

    private async validateStudentsById(studentIds: number[]): Promise<void> {
        if (studentIds.length === 0) {
            throw new BadRequestException("At least one student ID is required.");
        };
        const foundStudents = await this.studentRepository.findManyById(studentIds);
        if (foundStudents.length !== studentIds.length) {
            const foundIds = foundStudents.map(s => s.id);
            const notFoundIds = studentIds.filter(id => !foundIds.includes(id));
            throw new NotFoundException(`Student(s) with ID(s) ${notFoundIds.join(", ")} not found.`);
        }
    }
}