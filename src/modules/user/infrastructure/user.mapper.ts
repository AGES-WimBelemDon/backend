import { User as PrismaUser, Address as PrismaAddress, Class as PrismaClass, Role } from "@prisma/client";
import { AddressMapper } from "src/modules/address/infrastructure/address.mapper";
import { ClassMapper } from "src/modules/class/infrastructure/class.mapper";
import { User } from "../domain/exceptions/user.entity";

type PrismaUserWithRelations = PrismaUser & {
  address?: PrismaAddress | null;
  classes?: PrismaClass[];
};

export class UserMapper {
  static toDomain(prismaUser: PrismaUserWithRelations): User {
    return new User({
      id: prismaUser.id,
      uidFirebase: prismaUser.uidFirebase,
      fullName: prismaUser.fullName,
      email: prismaUser.email,
      role: prismaUser.role as Role,
      addressId: prismaUser.addressId ?? undefined,
      createdAt: prismaUser.createdAt,
      status: prismaUser.status,
      address: prismaUser.address ? AddressMapper.toDomain(prismaUser.address) : undefined,
      classes: prismaUser.classes?.map((c) => ClassMapper.toDomain(c)) || undefined,
    });
  }

  static toPersistence(user: User) {
    return {
      uidFirebase: user.getUidFirebase(),
      fullName: user.getFullName(),
      email: user.getEmail(),
      role: user.getRole(),
      addressId: user.getAddressId() ?? null,
      createdAt: user.getCreatedAt(),
      status: user.getStatus(),
    };
  }
};