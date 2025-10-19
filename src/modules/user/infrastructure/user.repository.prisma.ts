import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IUserRepository } from "../application/user.service.query.interfaces";
import {
  UserDetailedResponseDTO,
  UserResponseDTO,
} from "../application/user.dtos";
import { UserStatus } from "@prisma/client";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    uid: string,
    email: string,
    name: string,
  ): Promise<UserResponseDTO> {
    const user = await this.prisma.user.create({
      data: {
        fullName: name,
        email,
        uidFirebase: uid,
        address: {
          create: {
            cep: "91780-110",
            city: "Porto Alegre",
            state: "RS",
            street: "Av. Heitor Viêira",
            neighborhood: "Bemém Novo",
            number: "68",
          },
        },
      },
      include: {
        role: true,
      },
    });
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      role: user.role,
    };
  }

  async findAll(): Promise<UserResponseDTO[]> {
      const users = await this.prisma.user.findMany({
        include: {
          role: true,
        },
      });
    return users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      role: user.role,
    }));
  }

  async findByUid(uid: string): Promise<UserResponseDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { uidFirebase: uid },
      include: { role: true },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      role: user.role,
    };
  }

  async findById(id: number): Promise<UserDetailedResponseDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      role: user.role,
    };
  }

  async findByEmail(email: string): Promise<UserResponseDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      role: user.role,
    };
  }

  async disableUser(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.INATIVO },
    });
  }
}
