import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  Query,
  HttpCode,
} from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "../application/user.service";
import {
  RegisterUserDTO,
  LoginUserDTO,
  UserResponseDTO,
  GetUsersQueryDTO,
} from "../application/user.dtos";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/role.guard";
import { FirebaseAuthGuard } from "src/common/guards/firebase-auth.guard";
import { DbGuard } from "src/common/guards/db.guard";
import { Role, UserStatus } from "@prisma/client";
import { AuthErrorCode } from "../domain/exceptions/auth.exception";
import { Public } from "src/common/decorators/public.decorator";
import { RequestWithUser } from "src/common/interfaces/request.interface";

@Controller("user")
@ApiTags("user")
@ApiBearerAuth("JWT-auth")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.admin, Role.manager)
  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "User registered",
    type: UserResponseDTO,
  })
  @ApiResponse({ status: 400, description: "Email already in use" })
  async register(
    @Request() request: RequestWithUser,
    @Body() user: RegisterUserDTO,
  ): Promise<UserResponseDTO> {
    return this.userService.register(user, request);
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
  @Roles(Role.admin, Role.manager)
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "List of users",
    type: [UserResponseDTO],
  })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  async findAll(
    @Request() request: RequestWithUser,
    @Query() query: GetUsersQueryDTO,
  ): Promise<UserResponseDTO[]> {
    return this.userService.findAll(request, query);
  }

  @Get(":id")
  @Roles(Role.admin, Role.manager)
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserResponseDTO,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async findById(
    @Request() request: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UserResponseDTO | null> {
    return this.userService.findById(id, request);
  }

  @Patch("disable/:id")
  @Roles(Role.admin, Role.manager)
  @HttpCode(204)
  @ApiOperation({ summary: "Disable a user" })
  @ApiResponse({ status: 204, description: "User disabled" })
  async disableUser(
    @Request() request: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    return this.userService.disableUser(id, request);
  }

  @Patch("enable/:id")
  @Roles(Role.admin, Role.manager)
  @HttpCode(204)
  @ApiOperation({ summary: "Enable a user" })
  @ApiResponse({ status: 204, description: "User enabled" })
  async enableUser(
    @Request() request: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    return this.userService.enableUser(id, request);
  }
}
