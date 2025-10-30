import { User } from "../domain/exceptions/user.entity";

export const USER_REPOSITORY_TOKEN = "IUserRepository";

export interface IUserRepository {
  createUser(user: User): Promise<User>
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByUid(uid: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  disableUser(id: number): Promise<void>;
  enableUser(id: number): Promise<void>;
}
