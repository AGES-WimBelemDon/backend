import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { FamilyMemberService } from "../application/familyMember.service";
import { IFamilyMemberRepository } from "../domain/familyMember.repository.interface";
import { AddressService } from "src/modules/address/application/address.service";
import { StudentService } from "src/modules/student/application/student.service";
import { FamilyMemberEntity } from "../domain/familyMember.entity";
import { AddressEntity } from "src/modules/address/domain/address.entity";

const createDto = {
  fullName: "Joana",
  relationship: "Mãe",
  phoneNumber: "+555199999999",
  studentIds: [1],
  dateOfBirth: new Date("1990-01-01"),
  registrationNumber: "12345678901",
};

const makeFamilyMember = (
  overrides: Partial<ConstructorParameters<typeof FamilyMemberEntity>[0]> = {},
) =>
  new FamilyMemberEntity({
    id: overrides.id,
    fullName: overrides.fullName ?? "Joana",
    phoneNumber: overrides.phoneNumber ?? "+555199999999",
    relationship: overrides.relationship ?? "Mãe",
    email: overrides.email,
    socialName: overrides.socialName,
    race: overrides.race,
    gender: overrides.gender,
    educationLevel: overrides.educationLevel,
    dateOfBirth: overrides.dateOfBirth ?? new Date("1990-01-01"),
    socialPrograms: overrides.socialPrograms,
    employmentStatus: overrides.employmentStatus,
    nis: overrides.nis,
    registrationNumber: overrides.registrationNumber ?? "12345678901",
    studentIds: overrides.studentIds ?? [1],
    addressId: overrides.addressId ?? null,
  });

describe("FamilyMemberService", () => {
  let repository: jest.Mocked<IFamilyMemberRepository>;
  let addressService: jest.Mocked<AddressService>;
  let studentService: jest.Mocked<StudentService>;
  let service: FamilyMemberService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      delete: jest.fn(),
      findAllByStudentId: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByRegistrationNumber: jest.fn(),
      update: jest.fn(),
    };
    addressService = {
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AddressService>;
    studentService = {
      validateStudentsById: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<StudentService>;

    service = new FamilyMemberService(
      repository as unknown as IFamilyMemberRepository,
      addressService,
      studentService,
    );
  });

  it("should throw when CPF is invalid on create", async () => {
    await expect(
      service.create({ ...createDto, registrationNumber: "123" }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should throw when CPF already exists", async () => {
    repository.findByRegistrationNumber.mockResolvedValue(
      makeFamilyMember(),
    );

    await expect(service.create(createDto as any)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("should throw when email is already in use", async () => {
    repository.findByRegistrationNumber.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(makeFamilyMember());

    await expect(
      service.create({ ...createDto, email: "existing@email.com" } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("should throw when date of birth is in the future", async () => {
    repository.findByRegistrationNumber.mockResolvedValue(null);
    studentService.validateStudentsById.mockResolvedValue();
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);

    await expect(
      service.create({ ...createDto, dateOfBirth: future } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should create family member after validations", async () => {
    repository.findByRegistrationNumber.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(null);
    studentService.validateStudentsById.mockResolvedValue();
    addressService.findById.mockResolvedValue(
      new AddressEntity({
        street: "Rua",
        city: "Cidade",
        state: "RS",
        cep: "90000-000",
        neighborhood: "Centro",
      }),
    );
    const created = makeFamilyMember({ id: 10 });
    repository.create.mockResolvedValue(created);

    const result = await service.create({
      ...createDto,
      addressId: 5,
    } as any);

    expect(addressService.findById).toHaveBeenCalledWith(5);
    expect(studentService.validateStudentsById).toHaveBeenCalledWith([1]);
    expect(result).toBe(created);
  });

  it("should throw when updating nonexistent family member", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.update(1, { fullName: "New" } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should validate CPF before updating registration number", async () => {
    repository.findById.mockResolvedValue(makeFamilyMember());

    await expect(
      service.update(1, { registrationNumber: "123" } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should throw when new registration belongs to other family member", async () => {
    const existing = makeFamilyMember({ id: 1 });
    repository.findById.mockResolvedValue(existing);
    repository.findByRegistrationNumber.mockResolvedValue(
      makeFamilyMember({ id: 2 }),
    );

    await expect(
      service.update(1, { registrationNumber: "12345678909" } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("should throw when email already used by another member", async () => {
    const existing = makeFamilyMember({ id: 1 });
    repository.findById.mockResolvedValue(existing);
    repository.findByRegistrationNumber.mockResolvedValue(existing);
    repository.findByEmail.mockResolvedValue(makeFamilyMember({ id: 2 }));

    await expect(
      service.update(1, { email: "email@email.com" } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("should update family member and persist changes", async () => {
    const existing = makeFamilyMember({ id: 1 });
    repository.findById.mockResolvedValue(existing);
    repository.findByRegistrationNumber.mockResolvedValue(existing);
    repository.findByEmail.mockResolvedValue(existing);
    repository.update.mockResolvedValue(existing);

    await service.update(1, { fullName: "Updated" } as any);

    expect(repository.update).toHaveBeenCalledWith(existing);
  });

  it("should throw when adding address to member that already has one", async () => {
    repository.findById.mockResolvedValue(
      makeFamilyMember({ addressId: 5 }),
    );

    await expect(
      service.addAddressToFamilyMember(1, {} as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("should add address to member without one", async () => {
    repository.findById.mockResolvedValue(
      makeFamilyMember({ addressId: null }),
    );
    addressService.create.mockResolvedValue(
      new AddressEntity({
        street: "Rua",
        city: "Cidade",
        state: "RS",
        cep: "90000-000",
        neighborhood: "Centro",
        id: 9,
      }),
    );

    await service.addAddressToFamilyMember(1, {} as any);

    expect(repository.update).toHaveBeenCalled();
  });

  it("should throw when requesting address but none exists", async () => {
    repository.findById.mockResolvedValue(
      makeFamilyMember({ addressId: null }),
    );

    await expect(service.getFamilyMemberAddress(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should delete member address when removing", async () => {
    repository.findById.mockResolvedValue(
      makeFamilyMember({ addressId: 3 }),
    );

    await service.removeAddressFromFamilyMember(1);

    expect(addressService.delete).toHaveBeenCalledWith(3);
  });

  it("should throw when removing address that does not exist", async () => {
    repository.findById.mockResolvedValue(
      makeFamilyMember({ addressId: null }),
    );

    await expect(
      service.removeAddressFromFamilyMember(1),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should validate student existence before fetching related family members", async () => {
    studentService.findById.mockResolvedValue(null);

    await expect(service.findByStudentId(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    studentService.findById.mockResolvedValue({} as any);
    repository.findAllByStudentId.mockResolvedValue([makeFamilyMember()]);

    const result = await service.findByStudentId(1);

    expect(result).toHaveLength(1);
  });
});
