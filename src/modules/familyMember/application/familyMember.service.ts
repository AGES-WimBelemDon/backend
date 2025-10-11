import { 
    BadRequestException,
    ConflictException, 
    forwardRef, 
    Inject, 
    Injectable, 
    NotFoundException 
} from "@nestjs/common";
import { FAMILY_MEMBER_REPOSITORY_TOKEN, IFamilyMemberRepository } from "../domain/familyMember.repository.interface";
import { CreateFamilyMemberDTO } from "./createFamilyMember.dto";
import { UpdateFamilyMemberDTO } from "./updateFamilyMember.dto";
import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { AddressEntity } from "src/modules/address/domain/address.entity";
import { CreateAddressDTO } from "src/modules/address/application/create-address.dto";
import { AddressService } from "src/modules/address/application/address.service";
import { StudentService } from "src/modules/student/application/student.service";

@Injectable()
export class FamilyMemberService {
    constructor(
        @Inject(FAMILY_MEMBER_REPOSITORY_TOKEN)
        private readonly familyMemberRepository: IFamilyMemberRepository,

        private readonly addressService: AddressService,
        @Inject(forwardRef(() => StudentService))
        private readonly studentService: StudentService,
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
        
        if (dto.addressId != undefined) {
            await this.validateAddressById(dto.addressId);
        }
        await this.studentService.validateStudentsById(dto.studentIds);

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
            if (!UpdateFamilyMemberDTO.validateCPF(dto.registrationNumber)) {
                throw new BadRequestException("Invalid CPF");
            }
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
        if (dto.studentIds && dto.studentIds.length>0){
            for (let index = 0; index < dto.studentIds.length; index++) {
                const id = dto.studentIds[index];
                const student = await this.studentService.findById(id);
                if(!student){
                    throw new NotFoundException(`Student with ID ${id} not found.`);
                }
            }
        }
        if (dto.dateOfBirth) {
            if (dto.dateOfBirth > new Date()) {
                throw new BadRequestException('Date of birth cannot be in the future.');
            }
        }

        Object.keys(dto).forEach(key => {
            if(dto[key]){
                const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
                if (typeof existingFamilyMember[setterName] === 'function') {
                    existingFamilyMember[setterName](dto[key]);
                }
            }
        });
        
        return this.familyMemberRepository.update(existingFamilyMember);
    }

    async addAddressToFamilyMember(familyMemberId: number, dto: CreateAddressDTO): Promise<AddressEntity> {
        const familyMember = await this.findById(familyMemberId);
         if(familyMember.getAddressId() != null) {
            throw new ConflictException(
                `Family member with ID ${familyMember.getId()} already has an address in the database.`
            );
        }
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

        return await this.addressService.findById(addressId);
    }

    async removeAddressFromFamilyMember(familyMemberId: number): Promise<void> {
        const familyMember = await this.findById(familyMemberId);
        const addressId = familyMember.getAddressId();

        if (addressId == null) {
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
        const student = await this.studentService.findById(studentId);
        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found.`);
        }
        return this.familyMemberRepository.findAllByStudentId(studentId);
    }

    private async validateAddressById(addressId: number): Promise<void> {
        await this.addressService.findById(addressId);
    }

    
}