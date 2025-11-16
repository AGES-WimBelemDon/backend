import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { StudentService } from "../application/student.service";
import { IStudentRepository } from "../domain/student-repository.interface";
import { Student } from "../domain/student.entity";
import { StudentStatus } from "src/common/enums/domain.enums";
import { LevelService } from "src/modules/level/application/level.service";
import { AddressService } from "src/modules/address/application/address.service";
import { FamilyMemberService } from "src/modules/familyMember/application/familyMember.service";
import { AddressEntity } from "src/modules/address/domain/address.entity";

const makeStudent = (overrides: Partial<ConstructorParameters<typeof Student>[0]> = {}) =>
  new Student({
    fullName: "John Doe",
    registrationNumber: "12345678901",
    ...overrides,
  });

describe("StudentService", () => {
  let repository: jest.Mocked<IStudentRepository>;
  let levelService: jest.Mocked<LevelService>;
  let addressService: jest.Mocked<AddressService>;
  let familyMemberService: jest.Mocked<FamilyMemberService>;
  let service: StudentService;

  const baseDto: any = {
    fullName: "John Doe",
    registrationNumber: "12345678901",
    dateOfBirth: new Date("2010-01-01"),
    familyMembersId: [],
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByRegistrationNumber: jest.fn(),
      findById: jest.fn(),
      findManyById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    levelService = {
      getById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<LevelService>;
    addressService = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AddressService>;
    familyMemberService = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<FamilyMemberService>;

    service = new StudentService(
      repository as unknown as IStudentRepository,
      levelService,
      addressService,
      familyMemberService,
    );
  });

  it("should throw Conflict when creating a student with duplicated registration", async () => {
    repository.findByRegistrationNumber.mockResolvedValue(makeStudent());

    await expect(service.createStudent(baseDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("should validate dependencies before creating a student", async () => {
    repository.findByRegistrationNumber.mockResolvedValue(null);
    addressService.findById.mockResolvedValue(
      new AddressEntity({
        street: "A",
        city: "B",
        state: "RS",
        cep: "90000-000",
        neighborhood: "Centro",
      }),
    );
    levelService.getById.mockResolvedValue({} as any);
    familyMemberService.findById.mockResolvedValue({} as any);
    repository.create.mockResolvedValue(makeStudent({ id: 1 }));

    await service.createStudent({
      ...baseDto,
      addressId: 10,
      levelId: 20,
      familyMembersId: [1, 2],
    });

    expect(addressService.findById).toHaveBeenCalledWith(10);
    expect(levelService.getById).toHaveBeenCalledWith(20);
    expect(familyMemberService.findById).toHaveBeenCalledTimes(2);
    expect(repository.create).toHaveBeenCalled();
  });

  it("should throw BadRequest when date of birth is in the future", async () => {
    repository.findByRegistrationNumber.mockResolvedValue(null);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    await expect(
      service.createStudent({ ...baseDto, dateOfBirth: futureDate }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should throw NotFound when student is not found by id", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findByIdServeController(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should call level service when filtering students by levelId", async () => {
    repository.findAll.mockResolvedValue([]);
    levelService.getById.mockResolvedValue({} as any);

    await service.findAll({ levelId: 3, status: StudentStatus.ATIVO });

    expect(levelService.getById).toHaveBeenCalledWith(3);
    expect(repository.findAll).toHaveBeenCalledWith({
      levelId: 3,
      status: StudentStatus.ATIVO,
    });
  });

  it("should throw NotFound when updating a nonexistent student", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.update(1, { fullName: "Updated" } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should throw Conflict when updating registration number already taken", async () => {
    const existing = makeStudent({ id: 1 });
    repository.findById.mockResolvedValue(existing);
    repository.findByRegistrationNumber.mockResolvedValue(makeStudent({ id: 2 }));

    await expect(
      service.update(1, { registrationNumber: "00000000000" } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("should throw BadRequest when updating with future date of birth", async () => {
    const existing = makeStudent({ id: 1 });
    repository.findById.mockResolvedValue(existing);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    await expect(
      service.update(1, { dateOfBirth: futureDate } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should update student fields and persist them", async () => {
    const existing = makeStudent({ id: 1 });
    repository.findById.mockResolvedValue(existing);
    repository.findByRegistrationNumber.mockResolvedValue(existing);
    repository.update.mockResolvedValue(existing);

    await service.update(1, { fullName: "New Name" } as any);

    expect(existing.getFullName()).toBe("New Name");
    expect(repository.update).toHaveBeenCalledWith(existing);
  });

  it("should throw when adding address to unknown student", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.addAddressToStudent(1, {} as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should throw when student already has an address", async () => {
    const existing = makeStudent({ id: 1, addressId: 2 });
    repository.findById.mockResolvedValue(existing);

    await expect(
      service.addAddressToStudent(1, {} as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("should attach new address to student", async () => {
    const existing = makeStudent({ id: 1, addressId: null });
    repository.findById.mockResolvedValue(existing);
    addressService.create.mockResolvedValue(
      new AddressEntity({
        street: "A",
        city: "B",
        state: "RS",
        cep: "90000-000",
        neighborhood: "Centro",
        id: 5,
      }),
    );

    await service.addAddressToStudent(1, sampleAddressPayload());

    expect(addressService.create).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith(existing);
  });

  it("should throw when fetching address of student without assignment", async () => {
    const existing = makeStudent({ id: 1, addressId: null });
    repository.findById.mockResolvedValue(existing);

    await expect(service.getStudentAddress(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should return student address when present", async () => {
    const existing = makeStudent({ id: 1, addressId: 3 });
    repository.findById.mockResolvedValue(existing);
    const address = new AddressEntity({
      street: "A",
      city: "B",
      state: "RS",
      cep: "90000-000",
      neighborhood: "Centro",
      id: 3,
    });
    addressService.findById.mockResolvedValue(address);

    const result = await service.getStudentAddress(1);

    expect(result).toBe(address);
  });

  it("should remove student address and delete record", async () => {
    const existing = makeStudent({ id: 1, addressId: 3 });
    repository.findById.mockResolvedValue(existing);

    await service.removeAddressFromStudent(1);

    expect(repository.update).toHaveBeenCalledWith(existing);
    expect(addressService.delete).toHaveBeenCalledWith(3);
  });

  it("should throw when removing address that does not exist", async () => {
    const existing = makeStudent({ id: 1, addressId: null });
    repository.findById.mockResolvedValue(existing);

    await expect(service.removeAddressFromStudent(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should validate students by id array", async () => {
    repository.findManyById.mockResolvedValue([
      makeStudent({ id: 1 }),
      makeStudent({ id: 2 }),
    ]);

    await service.validateStudentsById([1, 2]);

    expect(repository.findManyById).toHaveBeenCalledWith([1, 2]);
  });

  it("should throw when validating students with empty array", async () => {
    await expect(service.validateStudentsById([])).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("should throw when some student ids are missing", async () => {
    repository.findManyById.mockResolvedValue([makeStudent({ id: 1 })]);

    await expect(service.validateStudentsById([1, 2])).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  function sampleAddressPayload() {
    return {
      street: "Rua X",
      city: "Cidade",
      state: "RS",
      cep: "90000-000",
      neighborhood: "Centro",
    };
  }
});
