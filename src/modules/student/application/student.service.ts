import { Injectable, Inject, ConflictException, BadRequestException } from "@nestjs/common";
import { IStudentRepository, STUDENT_REPOSITORY_TOKEN } from "../domain/student-repository.interface";
import { CreateStudentDTO } from "./create-student.dto";
import { Student } from "../domain/student.entity";

@Injectable()
export class StudentService {
    constructor(
        @Inject(STUDENT_REPOSITORY_TOKEN)
        private readonly studentRepository: IStudentRepository,
    ) {}

    async createStudent(createStudentDto: CreateStudentDTO): Promise<Student> {
        // Validação de CPF
        if (!CreateStudentDTO.validateCPF(createStudentDto.registrationNumber)) {
            throw new BadRequestException("CPF inválido");
        }

        // Verificar se CPF já está cadastrado
        const existingStudent = await this.studentRepository.findByRegistrationNumber(
            createStudentDto.registrationNumber
        );
        
        if (existingStudent) {
            throw new ConflictException("CPF já está em uso");
        }

        // Converter string de data para Date se fornecida
        let dateOfBirth: Date | undefined;
        if (createStudentDto.dateOfBirth) {
            dateOfBirth = new Date(createStudentDto.dateOfBirth);
            
            // Validar se a data é válida
            if (isNaN(dateOfBirth.getTime())) {
                throw new BadRequestException("Data de nascimento inválida");
            }

            // Validar se a data não é futura
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
}
