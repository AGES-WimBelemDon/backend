import { 
    Injectable, 
    Inject, 
    ConflictException, 
    BadRequestException, 
    NotFoundException 
} from "@nestjs/common";
import { IStudentRepository, STUDENT_REPOSITORY_TOKEN } from "../domain/student-repository.interface";
import { CreateStudentRequestDTO } from "./create-student.request.dto";
import { Student } from "../domain/student.entity";
import { UpdateStudentDTO } from "./update-student.dto";
import { AddressService } from "src/modules/address/application/address.service";
import { AddressEntity } from "src/modules/address/domain/address.entity";
import { CreateAddressDTO } from "src/modules/address/application/create-address.dto";
import { LevelService } from "src/modules/level/application/level.service";

@Injectable()
export class StudentService {
    constructor(
        @Inject(STUDENT_REPOSITORY_TOKEN)
        private readonly studentRepository: IStudentRepository,
        private readonly levelService: LevelService,
        private readonly addressService: AddressService,
        
    ) {}

    async createStudent(createStudentDto: CreateStudentRequestDTO): Promise<Student> {
        const existingStudent = await this.studentRepository.findByRegistrationNumber(
            createStudentDto.registrationNumber
        );
        if(createStudentDto.addressId){
            const addressId = createStudentDto.addressId;
            await this.addressService.findById(addressId);
        }
        if(createStudentDto.levelId){
            const levelId = createStudentDto.levelId;
            await this.levelService.getById(levelId);
        }
        if (existingStudent) {
            throw new ConflictException("The cpf number is already in use");
        }

        if (createStudentDto.dateOfBirth) {

            if (createStudentDto.dateOfBirth > new Date()) {
                throw new BadRequestException("Date of birth cannot be in the future.");
            }
        }

        const student = new Student({...createStudentDto});

        return await this.studentRepository.create(student);
    }

    async findById(id: number): Promise<Student | null> {
        return await this.studentRepository.findById(id);
    }

    async findByRegistrationNumber(registrationNumber: string): Promise<Student | null> {
        return await this.studentRepository.findByRegistrationNumber(registrationNumber);
    }

    async findAll(): Promise<Student[]> {
        return await this.studentRepository.findAll();
    }

    async update(id: number, dto: UpdateStudentDTO){
        const existingStudent = await this.studentRepository.findById(id);
        if (!existingStudent) {
            throw new NotFoundException(`Student with ID ${id} not found.`);
        }

        if (dto.registrationNumber) {
            const regOwner = await this.studentRepository.findByRegistrationNumber(dto.registrationNumber);
            if (regOwner && regOwner.getId() !== id) {
                throw new ConflictException(`CPF '${dto.registrationNumber}' is already in use.`);
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
                if (typeof existingStudent[setterName] === 'function') {
                    existingStudent[setterName](dto[key]);
                }
            }
        });

        return await this.studentRepository.update(existingStudent);
    }

    async delete(id: number): Promise<void> {
        await this.findById(id);
        return this.studentRepository.delete(id);
    }

    async addAddressToStudent(studentId: number, dto: CreateAddressDTO): Promise<AddressEntity> {
        const student = await this.findById(studentId);
        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found.`);
        }
        if(student.getAddressId()){
            throw new ConflictException(`Address assignment failed: Student ${studentId} already has an associated address. To change it, update the existing address or remove it first.`);
        }
        const newAddress = await this.addressService.create(dto);
        
        student.setAddressId(newAddress.id ?? null);
        await this.studentRepository.update(student);
        
        return newAddress;
    }

    async validateStudentsById(studentIds: number[]): Promise<void> {
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

    async getStudentAddress(studentId: number): Promise<AddressEntity> {
        const student = await this.findById(studentId);
        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found.`);
        }
        const addressId = student.getAddressId();

        if (!addressId) {
            throw new NotFoundException(`Student with ID ${studentId} does not have an address.`);
        }

        return this.addressService.findById(addressId);
    }

    async removeAddressFromStudent(studentId: number): Promise<void> {
        const student = await this.findById(studentId);
        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found.`);
        }
        const addressId = student.getAddressId();

        if (addressId === null || addressId === undefined) {
            throw new NotFoundException(`Student with ID ${studentId} does not have an address to remove.`);
        }

        student.setAddressId(null); 
        await this.studentRepository.update(student);
        await this.addressService.delete(addressId);
    }
}
