import { ApiProperty } from "@nestjs/swagger";
import { UserStatus } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class RoleDTO {
  @ApiProperty({ example: 1, description: "Role ID" })
  id: number;

  @ApiProperty({ example: "Admin", description: "Role name" })
  name: string;

  @ApiProperty({ example: "Administrator role", description: "Role description", nullable: true })
  description: string | null;
}

export class RegisterUserDTO {
  @ApiProperty({
    example: "user@example.com",
    description: "Email of the user to be registered",
  })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    example: "John Doe",
    description: "Full name of the user to be registered",
  })
  @IsString()
  name: string;
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

  @ApiProperty({ type: RoleDTO, nullable: true, description: "User role" })
  role: RoleDTO | null;
}

export class UserDetailedResponseDTO extends UserResponseDTO {
  // Can add additional fields here if needed in the future
}
