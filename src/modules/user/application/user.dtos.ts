import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RegisterUserDTO {
  @ApiProperty({
    example: "user@example.com",
    description: "Email of the user to be registered"
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: "John Doe",
    description: "Full name of the user to be registered"
  })
  @IsString()
  name: string;
}

export class LoginUserDTO {
  @ApiProperty({
    example: "eyJ...",
    description: "The authentication token from Firebase"
  })
  token: string;
}

export class UserResponseDTO {
  @ApiProperty({ example: 1, description: "User ID in the database" })
  id: number;

  @ApiProperty({ example: "user@example.com", description: "User email" })
  email: string;
}
