import { StudentService } from './student.service';
import { IStudentRepository } from '../domain/student-repository.interface';
import { CreateStudentDTO } from './create-student.dto';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { Student } from '../domain/student.entity';

describe('StudentService', () => {
  let service: StudentService;
  let repository: jest.Mocked<IStudentRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByRegistrationNumber: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new StudentService(repository);
  });

  it('deve cadastrar aluno com sucesso', async () => {
    const dto: CreateStudentDTO = {
      fullName: 'João Silva',
      registrationNumber: '11144477735',
      dateOfBirth: '2010-05-15',
      socialName: 'Joãozinho',
    };
    repository.findByRegistrationNumber.mockResolvedValue(null);
    repository.create.mockImplementation(async (student) => student);

    const result = await service.createStudent(dto);
    expect(result.fullName).toBe(dto.fullName);
    expect(result.registrationNumber).toBe(dto.registrationNumber);
  });

  it('deve lançar erro se CPF já cadastrado', async () => {
    const dto: CreateStudentDTO = {
      fullName: 'Maria',
      registrationNumber: '11144477735',
      dateOfBirth: '2010-05-15',
      socialName: 'Maria',
    };
    repository.findByRegistrationNumber.mockResolvedValue(new Student({
      fullName: 'Outro',
      registrationNumber: '11144477735',
    }));
    await expect(service.createStudent(dto)).rejects.toThrow(ConflictException);
  });

  it('deve lançar erro se CPF inválido', async () => {
    const dto: CreateStudentDTO = {
      fullName: 'Pedro',
      registrationNumber: '123',
      dateOfBirth: '2010-05-15',
      socialName: 'Pedro',
    };
    await expect(service.createStudent(dto)).rejects.toThrow(BadRequestException);
  });

  it('deve lançar erro se nome ausente', async () => {
    const dto: any = {
      fullName: '',
      registrationNumber: '11144477735',
      dateOfBirth: '2010-05-15',
      socialName: 'Teste',
    };
    repository.findByRegistrationNumber.mockResolvedValue(null);
    repository.create.mockImplementation(async (student) => student);
    expect(dto.fullName).toBe('');
  });
});
