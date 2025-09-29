import { 
    Injectable, 
    Inject, 
    ConflictException, 
    BadRequestException, 
    NotFoundException 
} from "@nestjs/common";
import { IStudentRepository, STUDENT_REPOSITORY_TOKEN } from "../domain/student-repository.interface";
import { CreateStudentDTO } from "./create-student.dto";
import { Student } from "../domain/student.entity";
import { UpdateStudentDTO } from "./update-student.dto";
import { AddressService } from "src/modules/address/application/address.service";
import { AddressEntity } from "src/modules/address/domain/address.entity";
import { CreateAddressDTO } from "src/modules/address/application/create-address.dto";

@Injectable()
export class StudentService {
    constructor(
        @Inject(STUDENT_REPOSITORY_TOKEN)
        private readonly studentRepository: IStudentRepository,

        private readonly addressService: AddressService,
        
    ) {}

    async createStudent(createStudentDto: CreateStudentDTO): Promise<Student> {
        if (!CreateStudentDTO.validateCPF(createStudentDto.registrationNumber)) {
            throw new BadRequestException("CPF inválido");
        }

        const existingStudent = await this.studentRepository.findByRegistrationNumber(
            createStudentDto.registrationNumber
        );
        
        if (existingStudent) {
            throw new ConflictException("CPF já está em uso");
        }

        let dateOfBirth: Date | undefined;
        if (createStudentDto.dateOfBirth) {
            dateOfBirth = new Date(createStudentDto.dateOfBirth);
            
            if (isNaN(dateOfBirth.getTime())) {
                throw new BadRequestException("Data de nascimento inválida");
            }

            if (dateOfBirth > new Date()) {
                throw new BadRequestException("Data de nascimento não pode ser futura");
            }
        }

        const student = new Student({
            fullName: createStudentDto.fullName,
            registrationNumber: createStudentDto.registrationNumber,
            dateOfBirth,
            socialName: createStudentDto.socialName,
        });

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
            if (!UpdateStudentDTO.validateCPF(dto.registrationNumber)) {
                throw new BadRequestException("Invalid CPF");
            }
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
            const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
            if (typeof existingStudent[setterName] === 'function') {
                existingStudent[setterName](dto[key]);
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
        const newAddress = await this.addressService.create(dto);
        
        student.setAddressId(newAddress.id);
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
