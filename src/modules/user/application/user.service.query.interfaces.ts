import { UserDetailedResponseDTO, UserResponseDTO } from "./user.dtos";

export const USER_REPOSITORY_TOKEN = "IUserRepository";

export interface IUserRepository {
  createUser(
    uid: string,
    email: string,
    name: string,
  ): Promise<UserResponseDTO>;
  findAll(): Promise<UserResponseDTO[]>;
  findById(id: number): Promise<UserDetailedResponseDTO | null>;
  findByUid(uid: string): Promise<UserResponseDTO | null>;
  findByEmail(email: string): Promise<UserResponseDTO | null>;
  disableUser(id: number): Promise<void>;
  enableUser(id: number): Promise<void>;
}
