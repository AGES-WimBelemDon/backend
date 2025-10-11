import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IAddressRepository } from "../domain/address.repository.interface";
import { AddressEntity } from "../domain/address.entity";
import { AddressMapper } from "./address.mapper";
import { UpdateAddressDTO } from "../application/update-address.dto";

@Injectable()
export class PrismaAddressRepository implements IAddressRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(address: AddressEntity): Promise<AddressEntity> {
        const newAddress = await this.prisma.address.create({
            data: {
                street: address.getStreet(),
                city: address.getCity(),
                state: address.getState(),
                cep: address.getCep(),
                neighborhood: address.getNeighborhood(),
                number: address.getNumber(),
                complement: address.getComplement(),
            }
        });
        return AddressMapper.toDomain(newAddress);
    }
    
    async findById(id: number): Promise<AddressEntity | null> {
        const address = await this.prisma.address.findUnique({ where: { id } });
        return address ? AddressMapper.toDomain(address) : null;
    }

    async update(id: number, dto: UpdateAddressDTO): Promise<AddressEntity> {
        const updatedAddress = await this.prisma.address.update({
            where: { id },
            data: dto,
        });
        return AddressMapper.toDomain(updatedAddress);
    }
    
    async delete(id: number): Promise<void> {
        await this.prisma.address.delete({ where: { id } });
    }
}