import { ApiProperty } from "@nestjs/swagger";
import { Role, UserStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { AddressResponseDTO } from "src/modules/address/application/address-response.dto";
import { CreateAddressDTO } from "src/modules/address/application/create-address.dto";

export class GetUsersQueryDTO {
  @ApiProperty({ example: Role.teacher, description: 'Filter by user role', enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ example: UserStatus.ATIVO, description: 'Filter by user status', enum: UserStatus, required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

export class RegisterUserDTO {
  @ApiProperty({
    example: "user@example.com",
    description: "Email of the user to be registered. Must be unique and valid.",
  })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    example: "John Doe",
    description: "Full name of the user to be registered",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: Role.teacher,
    description: "User role in the system",
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    example: {
      cep: "12345-678",
      street: "Rua Example",
      number: "123",
      complement: "Apt 4B",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
    },
    description: "User address information (optional). If provided, creates a new address record.",
    required: false,
    type: CreateAddressDTO,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDTO)
  address?: CreateAddressDTO;
}

export class LoginUserDTO {
  @ApiProperty({
    example: "eyJ...",
    description: "The authentication token from Firebase",
  })
  @IsString()
  token: string;
}

export class UserResponseDTO {
  @ApiProperty({ example: 1, description: "User ID in the database" })
  id: number;

  @ApiProperty({ example: "John Doe", description: "User full name" })
  fullName: string;

  @ApiProperty({ example: "user@example.com", description: "User email" })
  email: string;

  @ApiProperty({ example: "ATIVO", description: "User account status", enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ 
    example: Role.teacher, 
    description: "User role in the system", 
    enum: Role 
  })
  role: Role;

  @ApiProperty({ 
    example: {
      id: 1,
      cep: "12345-678",
      street: "Rua Example",
      number: "123",
      complement: "Apt 4B",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP"
    },
    description: "User address information",
    nullable: true,
    required: false
  })
  address: AddressResponseDTO | null;
}
