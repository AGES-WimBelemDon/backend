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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "../application/user.service";
import {
  RegisterUserDTO,
  LoginUserDTO,
  UserResponseDTO
} from "../application/user.dtos";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/role.guard";
import { FirebaseAuthGuard } from "src/common/guards/firebase-auth.guard";
import { DbGuard } from "src/common/guards/db.guard";
import { Role } from "src/common/enums/roles.enum";
import { AuthErrorCode } from "../domain/exceptions/auth.exception";
import { Public } from "src/common/decorators/public.decorator";

@Controller("user")
@ApiTags("user")
@ApiBearerAuth("JWT-auth")
@UseGuards(FirebaseAuthGuard, DbGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @Roles(Role.Admin)
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
  @Public()
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
  @Roles(Role.Admin, Role.Manager)
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
  @Roles(Role.Admin, Role.Manager)
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserResponseDTO,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UserResponseDTO | null> {
    return this.userService.findById(id);
  }

  @Patch("disable/:id")
  @Roles(Role.Admin)
  @ApiOperation({ summary: "Disable a user" })
  @ApiResponse({ status: 204, description: "User disabled" })
  async disableUser(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.userService.disableUser(id);
  }

  @Patch("enable/:id")
  @Roles(Role.Admin)
  @ApiOperation({ summary: "Enable a user" })
  @ApiResponse({ status: 204, description: "User enabled" })
  async enableUser(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.userService.enableUser(id);
  }
}
