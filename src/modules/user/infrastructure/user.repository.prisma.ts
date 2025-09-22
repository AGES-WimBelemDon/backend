import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IUserRepository } from "../application/user.service.query.interfaces";
import { UserResponseDTO } from "../application/user.dtos";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(uid: string, email: string, name: string): Promise<UserResponseDTO> {
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
          }
        }
      },
    });
    return { id: user.id, email: user.email };
  }

  async findByUid(uid: string): Promise<UserResponseDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { uidFirebase: uid }
    });
    if (!user) {
      return null;
    }
    return { id: user.id, email: user.email };
  }

  async findByEmail(email: string): Promise<UserResponseDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return null;
    }
    return { id: user.id, email: user.email };
  }
}
