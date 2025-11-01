import {
  Inject,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
} from "./user.service.query.interfaces";
import {
  RegisterUserDTO,
  UserResponseDTO,
  LoginUserDTO,
  GetUsersQueryDTO,
} from "./user.dtos";
import { FirebaseService } from "src/modules/firebase/application/firebase.service";
import { UserStatus } from "@prisma/client";
import { AuthException, AuthErrorCode } from "../domain/exceptions/auth.exception";
import { auth } from "firebase-admin";
import { User } from "../domain/exceptions/user.entity";
import { AddressEntity } from "src/modules/address/domain/address.entity";
import { UserResponseMapper } from "./mapper/user.response.mapper";
import { Role } from "src/common/enums/roles.enum";
import { RequestWithUser } from "src/common/interfaces/request.interface";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  async register(user: RegisterUserDTO, request: RequestWithUser): Promise<UserResponseDTO> {
    const existing = await this.userRepository.findByEmail(user.email);
    if (existing) {
      throw new BadRequestException("Email already registered");
    }

    const requestingUserRole = request.user?.role as Role;
    if (requestingUserRole !== Role.Admin
      && [Role.Admin, Role.Manager].includes(user.role)
    ) {
      throw new ForbiddenException("Insufficient permissions to assign this role");
    }

    let firebaseUser: auth.UserRecord | null = null;
    try {
      firebaseUser = await this.firebaseService.getFirebaseUserByEmail(user.email);
      if (!firebaseUser) {
        firebaseUser = await this.firebaseService.createFirebaseUser(user);
      }
      const userEntity = new User({
        uidFirebase: firebaseUser.uid,
        email: user.email,
        fullName: user.name,
        role: user.role,
      });
      if (user.address) {
        const addressEntity = new AddressEntity({
          cep: user.address.cep,
          street: user.address.street,
          number: user.address.number,
          complement: user.address.complement,
          neighborhood: user.address.neighborhood,
          city: user.address.city,
          state: user.address.state,
        });
        userEntity.setAddress(addressEntity);
      }

      const createdUser = await this.userRepository.createUser(userEntity);
      
      return UserResponseMapper.toDTO(createdUser);
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
      throw new AuthException(
        AuthErrorCode.INVALID_TOKEN,
        "Invalid Firebase token"
      );
    }

    const user = await this.userRepository.findByUid(decoded.uid);
    if (!user) {
      throw new AuthException(
        AuthErrorCode.USER_NOT_REGISTERED,
        "User not registered in system"
      );
    }

    if (user.getStatus() !== UserStatus.ATIVO) {
      throw new AuthException(
        AuthErrorCode.USER_INACTIVE,
        "User account is not active"
      );
    }
    
    return UserResponseMapper.toDTO(user);
  }

  async findAll(request: RequestWithUser, query: GetUsersQueryDTO): Promise<UserResponseDTO[]> {
    const requestingUserRole = request.user?.role as Role;
    
    const requestedRole = query.role;
    
    const isAdmin = requestingUserRole === Role.Admin;

    if (!isAdmin && requestedRole && [Role.Admin, Role.Manager].includes(requestedRole)) {
      throw new ForbiddenException('Insufficient permissions to query Admin/Manager users');
    }

    const where: Prisma.UserWhereInput = {
      status: query.status,
      role: {
        equals: requestedRole || undefined,
        notIn: !isAdmin ? [Role.Admin, Role.Manager] : undefined,
      }
    };

    const users = await this.userRepository.findAll(where);

    return UserResponseMapper.toDTOList(users);
  }

  async findById(id: number, request: RequestWithUser): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }

    const requestingUserRole = request.user?.role as Role;
    if (requestingUserRole !== Role.Admin
      && [Role.Admin, Role.Manager].includes(user.getRole())
    ) {
      throw new ForbiddenException("Insufficient permissions to view this user");
    }

    return UserResponseMapper.toDTO(user);
  }

  async disableUser(id: number, request: RequestWithUser): Promise<void> {
    const requestingUser = request.user;
    if (requestingUser.id === id) {
      throw new BadRequestException("Users cannot disable their own accounts");
    }

    const userToDisable = await this.userRepository.findById(id);
    if (!userToDisable) {
      throw new BadRequestException("User not found");
    }

    if (requestingUser.role !== Role.Admin
      && [Role.Admin, Role.Manager].includes(userToDisable.getRole())
    ) {
      throw new ForbiddenException("Insufficient permissions to disable this user");
    }
    
    return await this.userRepository.disableUser(id);
  }

  async enableUser(id: number, request: RequestWithUser): Promise<void> {
    const requestingUser = request.user;

    const userToEnable = await this.userRepository.findById(id);
    if (!userToEnable) {
      throw new BadRequestException("User not found");
    }

    if (requestingUser.role !== Role.Admin
      && [Role.Admin, Role.Manager].includes(userToEnable.getRole())
    ) {
      throw new ForbiddenException("Insufficient permissions to enable this user");
    }

    return await this.userRepository.enableUser(id);
  }
}
