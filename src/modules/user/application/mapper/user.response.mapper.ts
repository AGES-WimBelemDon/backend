import { AddressMapper } from "src/modules/address/infrastructure/address.mapper";
import { User } from "../../domain/exceptions/user.entity";
import { UserResponseDTO } from "../user.dtos";


export class UserResponseMapper {
  static toDTO(user: User): UserResponseDTO {
    const dto = new UserResponseDTO();
    
    dto.id = user.getId()!;
    dto.fullName = user.getFullName();
    dto.email = user.getEmail();
    dto.status = user.getStatus();
    dto.role = user.getRole();
    dto.address = user.getAddress() 
        ? AddressMapper.toResponse(user.getAddress()!) 
        : null;
    
    return dto;
  }

  static toDTOList(users: User[]): UserResponseDTO[] {
    return users.map((user) => this.toDTO(user));
  }
}