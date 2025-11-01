import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IUserRepository } from "../application/user.service.query.interfaces";
import { UserStatus, Prisma } from "@prisma/client";
import { User } from "../domain/exceptions/user.entity";
import { UserMapper } from "./user.mapper";
import { AddressMapper } from "src/modules/address/infrastructure/address.mapper";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    
    if (user.getAddress() && !user.getAddressId()) {
      const addressData = AddressMapper.toPersistence(user.getAddress()!);
      const { addressId, ...dataWithoutAddressId } = data;
      const created = await this.prisma.user.create({
        data: {
          ...dataWithoutAddressId,
          address: {
            create: addressData,
          },
        },
        include: {
          address: true,
          classes: true,
        },
      });
      
      return UserMapper.toDomain(created);
    }
    const created = await this.prisma.user.create({
      data,
      include: {
        address: true,
        classes: true,
      },
    });
    
    return UserMapper.toDomain(created);
  }

  async findAll(where?: Prisma.UserWhereInput): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: where ?? {},
      include: {
        address: true,
        classes: true,
      },
    });

    return users.map((user) => UserMapper.toDomain(user));
  }

  async findByUid(uid: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { uidFirebase: uid },
      include: {
        address: true,
        classes: true,
      },
    });
    
    if (!user) {
      return null;
    }
    
    return UserMapper.toDomain(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        address: true,
        classes: true,
      },
    });
    
    if (!user) {
      return null;
    }
    
    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        address: true,
        classes: true,
      },
    });
    
    if (!user) {
      return null;
    }
    
    return UserMapper.toDomain(user);
  }

  async disableUser(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.INATIVO },
    });
  }

  async enableUser(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.ATIVO },
    });
  }
}
