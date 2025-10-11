import { UpdateAddressDTO } from '../application/update-address.dto';
import { AddressEntity } from './address.entity';

export const ADDRESS_REPOSITORY_TOKEN = "AddressRepository";

export interface IAddressRepository {
    create(address: AddressEntity): Promise<AddressEntity>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<AddressEntity | null>;
    update(id: number, dto: UpdateAddressDTO ): Promise<AddressEntity>;
}