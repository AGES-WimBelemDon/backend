
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ADDRESS_REPOSITORY_TOKEN, IAddressRepository } from "../domain/address.repository.interface";
import { AddressEntity } from "../domain/address.entity";
import { CreateAddressDTO } from "./create-address.dto";
import { UpdateAddressDTO } from './update-address.dto'

@Injectable()
export class AddressService {
    constructor(
        @Inject(ADDRESS_REPOSITORY_TOKEN)
        private readonly addressRepository: IAddressRepository,
    ) {}

    async create(dto: CreateAddressDTO): Promise<AddressEntity> {
        const addressEntity = new AddressEntity(dto);
        return this.addressRepository.create(addressEntity);
    }

    async findById(id: number): Promise<AddressEntity> {
        const address = await this.addressRepository.findById(id);
        if (!address) {
            throw new NotFoundException(`Address with ID ${id} not found.`);
        }
        return address;
    }
    
    async update(id: number, dto: UpdateAddressDTO): Promise<AddressEntity> {
        await this.findById(id); 
        return this.addressRepository.update(id, dto);
    }

    async delete(id: number): Promise<void> {
        await this.findById(id);
        return this.addressRepository.delete(id);
    }
}