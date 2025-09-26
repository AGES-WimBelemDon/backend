import { AddressEntity } from '../domain/address.entity';
import { Address as PrismaAddress } from '@prisma/client';

export class AddressMapper {
    static toDomain(prismaAddress: PrismaAddress): AddressEntity {
        return new AddressEntity({
            id: prismaAddress.id,
            street: prismaAddress.street,
            city: prismaAddress.city,
            state: prismaAddress.state,
            cep: prismaAddress.cep,
            neighborhood: prismaAddress.neighborhood,
            complement: prismaAddress.complement || undefined,
            number: prismaAddress.number || undefined,
        });
    }
    static toResponse(address: AddressEntity) {
        return {
            id: address.getId(),
            street: address.getStreet(),
            city: address.getCity(),
            state: address.getState(),
            cep: address.getCep(),
            neighborhood: address.getNeighborhood(),
            complement: address.getComplement(),
            number: address.getNumber(),
        };
    }
}