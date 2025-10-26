import { PrismaService } from "src/prisma/prisma.service";
import { IClassQueries } from "../application/class.service.query.interfaces";
import { Teacher } from "../domain/teacher";
import { Injectable } from "@nestjs/common";
@Injectable()
export class ClassQueryServicePrisma implements IClassQueries {
  constructor(private readonly prisma: PrismaService) {}
  async getManyByTeacherId(teachersIds: number[]): Promise<Teacher[]> {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: teachersIds,
        },
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    return users.map((user) => new Teacher(user.id, user.fullName));
  }
}
