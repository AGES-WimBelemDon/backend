import { Inject, Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { USER_REPOSITORY_TOKEN, IUserRepository } from "./user.service.query.interfaces";
import { RegisterUserDTO, UserResponseDTO, LoginUserDTO } from "./user.dtos";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async register(dto: RegisterUserDTO): Promise<UserResponseDTO> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException("Email already registered");
    }

    const fakeUid = "uid_" + Math.random().toString(36).substring(2, 10);

    return this.userRepository.createUser(fakeUid, dto.email, dto.name);
  }

  async login(dto: LoginUserDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByUid(dto.token);
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }
    return user;
  }
}
