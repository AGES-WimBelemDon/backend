import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  Query,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { ClassService } from "../application/class.service";
import { CreateClassDTO } from "../application/create-class.dto";
import { ClassMapper } from "../infrastructure/class.mapper";
import { Class } from "@prisma/client";
import { UpdateClassDTO } from "../application/update-class.dto";

@ApiTags("classes")
@Controller("classes")
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Register new class",
    description: "Registers a new class in the system",
  })
  @ApiResponse({
    status: 201,
    description: "Class successfully created",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid data",
  })
  @ApiResponse({
    status: 404,
    description: "Not found",
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  async createClass(@Body() createClassDto: CreateClassDTO) {
    const classEntity = await this.classService.createClass(createClassDto);
    return ClassMapper.toResponse(classEntity);
  }

  @Get()
  @ApiOperation({
    summary: "List classes",
    description:
      "Lists all classes with optional filters: activityId, levelId, state",
  })
  @ApiResponse({
    status: 200,
    description:
      "List of classes (possibly empty) filtered by the provided query parameters",
  })
  @ApiResponse({
    status: 400,
    description:
      "Bad Request - invalid query params (e.g., invalid number format)",
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  @ApiQuery({ name: "activityId", required: false, type: Number })
  @ApiQuery({ name: "levelId", required: false, type: Number })
  @ApiQuery({ name: "state", required: false, type: String })
  async getClasses(
    @Query("activityId") activityId?: number,
    @Query("levelId") levelId?: number,
    @Query("state") state?: string
  ) {
    const classesEntities = (
      await this.classService.findAll(activityId, levelId, state)
    ).map(ClassMapper.toResponse);
    return classesEntities;
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get class by ID",
    description:
      "Returns detailed information of a class, including schedules and teachers",
  })
  @ApiResponse({
    status: 200,
    description: "Class successfully retrieved",
  })
  @ApiResponse({
    status: 404,
    description: "Class not found",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - invalid ID or query parameters",
  })
  @ApiParam({ name: "id", type: String })
  @ApiQuery({ name: "activityId", required: false, type: Number })
  @ApiQuery({ name: "levelId", required: false, type: Number })
  @ApiQuery({ name: "state", required: false, type: String })
  async getClassesById(
    @Param("id", ParseIntPipe) id: number,
    @Query("activityId") activityId?: number,
    @Query("levelId") levelId?: number,
    @Query("state") state?: string
  ) {
    const classEntity = await this.classService.findById(
      id,
      activityId,
      levelId,
      state
    );
    return ClassMapper.toResponse(classEntity);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Update class (partial)",
    description:
      "Partially updates class data and/or its associations (teachers, schedules).",
  })
  @ApiResponse({
    status: 204,
    description: "Class successfully updated (no content returned)",
  })
  @ApiResponse({
    status: 400,
    description:
      "Bad Request - invalid format (dates, times, state, or daysOfWeek)",
  })
  @ApiResponse({
    status: 404,
    description:
      "Not Found - class doesn't exist or invalid foreign keys (activity/level/teacher)",
  })
  async updateClass(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateClassDto: UpdateClassDTO
  ) {
    const updated = await this.classService.update(id, updateClassDto);
    if (!updated) {
      throw new NotFoundException("Class not found or invalid references");
    }
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a existing class",
    description: "Remove a class from the database",
  })
  @ApiResponse({
    status: 200,
    description: "Class was successfully removed",
  })
  @ApiResponse({
    status: 404,
    description: "Class not found",
  })
  async deleteClass(@Param("id", ParseIntPipe) id: number) {
    return await this.classService.deleteClass(id);
  }
}
