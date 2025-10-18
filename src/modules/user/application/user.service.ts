import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
} from "./user.service.query.interfaces";
import {
  RegisterUserDTO,
  UserResponseDTO,
  LoginUserDTO,
  UserDetailedResponseDTO,
} from "./user.dtos";
import { FirebaseService } from "src/modules/firebase/application/firebase.service";
import { UserStatus } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  async register(user: RegisterUserDTO): Promise<UserResponseDTO> {
    const existing = await this.userRepository.findByEmail(user.email);
    if (existing) {
      throw new BadRequestException("Email already registered");
    }

    let firebaseUser;
    try {
      firebaseUser = await this.firebaseService.createFirebaseUser(user);
      const dbUser = await this.userRepository.createUser(
        firebaseUser.uid,
        user.email,
        user.name,
      );
      return dbUser;
    } catch (error) {
      if (firebaseUser?.uid) {
        await this.firebaseService.deleteFirebaseUser(firebaseUser.uid);
      }
      throw new BadRequestException(
        "Failed to register user: " + error.message,
      );
    }
  }

  async login({ token }: LoginUserDTO): Promise<UserResponseDTO> {
    const decoded = await this.firebaseService.verifyIdToken(token);
    if (!decoded?.uid) {
      throw new UnauthorizedException("Invalid Firebase token");
    }

    const user = await this.userRepository.findByUid(decoded.uid);
    if (!user) {
      throw new UnauthorizedException("User not registered in system");
    }

    if (!(user.status === UserStatus.ATIVO)) {
      throw new UnauthorizedException("User account is not active");
    }
    
    return user;
  }

  async findAll(): Promise<UserResponseDTO[]> {
    return this.userRepository.findAll();
  }

  async findById(id: number): Promise<UserDetailedResponseDTO | null> {
    return this.userRepository.findById(id);
  }

  async disableUser(id: number): Promise<void> {
    return await this.userRepository.disableUser(id);
  }
}
