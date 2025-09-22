import { Module } from "@nestjs/common";
import { UserController } from "./presentation/user.controller";
import { UserService } from "./application/user.service";
import { USER_REPOSITORY_TOKEN } from "./application/user.service.query.interfaces";
import { PrismaUserRepository } from "./infrastructure/user.repository.prisma";

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository
    },
    UserService
  ],
  exports: [UserService, USER_REPOSITORY_TOKEN]
})
export class UserModule {}
