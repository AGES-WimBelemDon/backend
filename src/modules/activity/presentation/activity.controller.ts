import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ActivityService } from "../application/activity.service";
import { CreateActivityRequestDto } from "../application/create-activity.request.dto";
import { ActivityMapper } from "../infrastructure/activity.mapper";
import { ActivityResponseDto } from "../application/activity.response.dto";
import { UpdateActivityDto } from "../application/update-activity.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@ApiTags("activities")
@Controller("activities")
@ApiBearerAuth("JWT-auth")
@Roles(Role.admin, Role.manager, Role.psychologist, Role.social_worker, Role.teacher)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new activity",
    description: "Registers a new activity in the catalog",
  })
  @ApiCreatedResponse({
    description: "Activity successfully created",
    type: ActivityResponseDto,
    schema: {
      example: { id: 1, name: "Esporte" },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid payload",
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ["Name is required"],
        error: "Bad Request",
      },
    },
  })
  @ApiConflictResponse({
    description: "Activity name already exists",
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: "Activity name 'Esporte' is already in use.",
        error: "Conflict",
      },
    },
  })
  async create(
    @Body() dto: CreateActivityRequestDto,
  ): Promise<ActivityResponseDto> {
    const activity = await this.activityService.create(dto);
    return ActivityMapper.toResponse(activity);
  }

  @Get()
  @Roles(Role.psychology_intern, Role.social_work_intern)
  @ApiOperation({
    summary: "List activities",
    description: "Retrieves all registered activities",
  })
  @ApiOkResponse({
    description: "List of activities",
    type: [ActivityResponseDto],
    schema: {
      example: [
        { id: 1, name: "Esporte" },
        { id: 2, name: "Artes" },
      ],
    },
  })
  async findAll(): Promise<ActivityResponseDto[]> {
    const activities = await this.activityService.findAll();
    return activities.map(ActivityMapper.toResponse);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update an activity",
    description: "Updates the name of an existing activity",
  })
  @ApiOkResponse({
    description: "Activity successfully updated",
    type: ActivityResponseDto,
    schema: {
      example: { id: 1, name: "Esportes" },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid payload",
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ["Name is required"],
        error: "Bad Request",
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Activity not found",
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: "Activity with ID 99 not found.",
        error: "Not Found",
      },
    },
  })
  @ApiConflictResponse({
    description: "Activity name already exists",
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: "Activity name 'Artes' is already in use.",
        error: "Conflict",
      },
    },
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateActivityDto,
  ): Promise<ActivityResponseDto> {
    const activity = await this.activityService.update(id, dto);
    return ActivityMapper.toResponse(activity);
  }
}
