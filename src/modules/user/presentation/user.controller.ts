import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "../application/user.service";
import { RegisterUserDTO, LoginUserDTO, UserResponseDTO } from "../application/user.dtos";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered", type: UserResponseDTO })
  @ApiResponse({ status: 400, description: "Email already in use" })
  async register(@Body() dto: RegisterUserDTO): Promise<UserResponseDTO> {
    return this.userService.register(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User logged in", type: UserResponseDTO })
  @ApiResponse({ status: 401, description: "Invalid token" })
  async login(@Body() dto: LoginUserDTO): Promise<UserResponseDTO> {
    return this.userService.login(dto);
  }
}
