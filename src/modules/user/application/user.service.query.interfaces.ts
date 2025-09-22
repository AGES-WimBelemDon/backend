import { UserResponseDTO } from "./user.dtos";

export const USER_REPOSITORY_TOKEN = "IUserRepository";

export interface IUserRepository {
  createUser(uid: string, email: string, name: string): Promise<UserResponseDTO>;
  findByUid(uid: string): Promise<UserResponseDTO | null>;
  findByEmail(email: string): Promise<UserResponseDTO | null>;
}
