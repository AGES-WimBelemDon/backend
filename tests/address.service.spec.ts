import { NotFoundException } from "@nestjs/common";
import { AddressService } from "src/modules/address/application/address.service";
import { IAddressRepository } from "src/modules/address/domain/address.repository.interface";
import { AddressEntity } from "src/modules/address/domain/address.entity";

describe("AddressService", () => {
  let repository: jest.Mocked<IAddressRepository>;
  let service: AddressService;

  const sampleDto = {
    street: "Main",
    city: "Porto Alegre",
    state: "RS",
    cep: "90000-000",
    neighborhood: "Centro",
    number: "10",
    complement: "Ap 101",
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new AddressService(repository);
  });

  it("should create an address entity and delegate to repository", async () => {
    const created = new AddressEntity({ ...sampleDto, id: 1 });
    repository.create.mockResolvedValue(created);

    const result = await service.create(sampleDto);

    expect(repository.create).toHaveBeenCalledWith(
      expect.any(AddressEntity),
    );
    expect(result).toBe(created);
  });

  it("should return address when found", async () => {
    const entity = new AddressEntity({ ...sampleDto, id: 5 });
    repository.findById.mockResolvedValue(entity);

    const result = await service.findById(5);

    expect(result).toBe(entity);
  });

  it("should throw NotFound when address is missing", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(9)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should update an address after ensuring it exists", async () => {
    const entity = new AddressEntity({ ...sampleDto, id: 7 });
    repository.findById.mockResolvedValue(entity);
    repository.update.mockResolvedValue(entity);

    await service.update(7, sampleDto);

    expect(repository.findById).toHaveBeenCalledWith(7);
    expect(repository.update).toHaveBeenCalledWith(7, sampleDto);
  });

  it("should delete an address after verifying existence", async () => {
    const entity = new AddressEntity({ ...sampleDto, id: 2 });
    repository.findById.mockResolvedValue(entity);

    await service.delete(2);

    expect(repository.findById).toHaveBeenCalledWith(2);
    expect(repository.delete).toHaveBeenCalledWith(2);
  });
});

