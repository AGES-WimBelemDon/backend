import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "../application/user.service";
import {
  RegisterUserDTO,
  LoginUserDTO,
  UserResponseDTO,
  UserDetailedResponseDTO,
} from "../application/user.dtos";
import { FirebaseAuthGuard } from "src/modules/auth/guards/firebase-auth.guard";
import { AuthErrorCode } from "../domain/exceptions/auth.exception";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  // TODO: Enable guard when admin users are implemented
  // @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "User registered",
    type: UserResponseDTO,
  })
  @ApiResponse({ status: 400, description: "Email already in use" })
  async register(@Body() dto: RegisterUserDTO): Promise<UserResponseDTO> {
    return this.userService.register(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({
    status: 200,
    description: "User logged in",
    type: UserResponseDTO,
  })
  @ApiResponse({ 
    status: 401, 
    description: "Authentication failed",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid Firebase token' },
        code: { 
          type: 'string', 
          enum: Object.values(AuthErrorCode),
          example: AuthErrorCode.INVALID_TOKEN
        },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  async login(@Body() dto: LoginUserDTO): Promise<UserResponseDTO> {
    return this.userService.login(dto);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  // TODO: Implement RBAC guard for admin-only access
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "List of users",
    type: [UserResponseDTO],
  })
  async findAll(): Promise<UserResponseDTO[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserDetailedResponseDTO,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UserDetailedResponseDTO | null> {
    return this.userService.findById(id);
  }

  @Patch("disable/:id")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Disable a user" })
  @ApiResponse({ status: 204, description: "User disabled" })
  async disableUser(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.userService.disableUser(id);
  }
}
