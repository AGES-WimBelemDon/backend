import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ClassService } from "../application/class.service";
import { CreateClassDTO } from "../application/dtos/create-class.request.dto";
import { ClassQueryFilters, ClassResponseDTO } from "../application/dtos";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ClassState } from "src/common/enums/domain.enums";
import { UpdateClassDTO } from "../application/dtos/update-class.request.dto";
import { DeleteClassResponseDTO } from "../application/dtos/delete-class.response.dto";

@ApiTags("classes")
@Controller("classes")
@ApiBearerAuth("JWT-auth")
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @ApiOperation({
    summary: "Create a new class",
    description:
      "Creates a new class with optional teacher assignments and weekly schedules. " +
      "Validates level existence, teacher IDs, and time values. " +
      "For recurrent classes, at least one day of the week must be specified.",
  })
  @ApiBody({
    type: CreateClassDTO,
    examples: {
      recurrentClass: {
        summary: "Recurrent class with multiple teachers",
        description:
          "A guitar class that occurs on Monday, Wednesday, and Friday",
        value: {
          name: "Advanced Guitar Class",
          activityId: 1,
          levelId: 2,
          teacherIds: [1, 2],
          isRecurrent: true,
          startDate: "2025-03-01",
          endDate: "2025-06-01",
          startTime: "09:00:00",
          endTime: "10:30:00",
          dayOfWeek: ["SEGUNDA", "QUARTA", "SEXTA"],
        },
      },
      nonRecurrentClass: {
        summary: "Non-recurrent single-session class",
        description: "A one-time workshop without weekly repetition",
        value: {
          name: "Piano Workshop",
          activityId: 3,
          levelId: 1,
          teacherIds: [5],
          isRecurrent: false,
          startDate: "2025-03-15",
          startTime: "14:00:00",
          endTime: "16:00:00",
        },
      },
      classWithoutTeachers: {
        summary: "Class without assigned teachers",
        description: "A class created without teacher assignments",
        value: {
          name: "Beginner Violin Class",
          activityId: 2,
          levelId: 1,
          isRecurrent: true,
          startDate: "2025-04-01",
          startTime: "10:00:00",
          endTime: "11:00:00",
          dayOfWeek: ["TERCA", "QUINTA"],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Class created successfully",
    type: ClassResponseDTO,
    schema: {
      example: {
        id: 1,
        name: "Advanced Guitar Class",
        activityId: 1,
        levelId: 2,
        state: "ATIVA",
        teachers: [
          { id: 1, fullName: "John Smith" },
          { id: 2, fullName: "Jane Doe" },
        ],
        isRecurrent: true,
        startDate: "2025-03-01",
        endDate: "2025-06-01",
        startTime: "09:00:00",
        endTime: "10:30:00",
        schedules: [
          { id: 1, dayOfWeek: "SEGUNDA" },
          { id: 2, dayOfWeek: "QUARTA" },
          { id: 3, dayOfWeek: "SEXTA" },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Validation failed",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            statusCode: { type: "number", example: 400 },
            message: { type: "string" },
            error: { type: "string", example: "Bad Request" },
          },
        },
        examples: {
          invalidTeacherId: {
            summary: "Invalid teacher ID",
            value: {
              statusCode: 400,
              message: "Cannot create class: an invalid teacherId was passed",
              error: "Bad Request",
            },
          },
          recurrentWithoutDays: {
            summary: "Recurrent class without days",
            value: {
              statusCode: 400,
              message:
                "Cannot create recurrent class: dayOfWeek array cannot be empty when isRecurrent is true",
              error: "Bad Request",
            },
          },
          invalidTime: {
            summary: "Invalid time value",
            value: {
              statusCode: 400,
              message:
                "Cannot create class: invalid start or end time provided.",
              error: "Bad Request",
            },
          },
          invalidTimeFormat: {
            summary: "Invalid time format",
            value: {
              statusCode: 400,
              message: ["startTime must be in HH:mm:ss format"],
              error: "Bad Request",
            },
          },
          validationErrors: {
            summary: "Multiple validation errors",
            value: {
              statusCode: 400,
              message: [
                "name should not be empty",
                "activityId must be a number",
                "startDate must be a Date instance",
              ],
              error: "Bad Request",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Level does not exist",
    schema: {
      example: {
        statusCode: 404,
        message: "Level with ID 99 not found",
        error: "Not Found",
      },
    },
  })
  async createClass(
    @Body() createClassDto: CreateClassDTO,
  ): Promise<ClassResponseDTO> {
    return await this.classService.createClass(createClassDto);
  }
  @Get()
  @ApiOperation({
    summary: "Get all classes with optional filters",
    description:
      "Retrieves a list of classes. Results can be filtered by class ID, level ID, activity ID, or status. " +
      "Returns all classes if no filters are provided.",
  })
  @ApiQuery({
    name: "classId",
    required: false,
    type: Number,
    description: "Filter by specific class ID",
    example: 1,
  })
  @ApiQuery({
    name: "levelId",
    required: false,
    type: Number,
    description: "Filter by level ID",
    example: 2,
  })
  @ApiQuery({
    name: "activityId",
    required: false,
    type: Number,
    description: "Filter by activity ID",
    example: 3,
  })
  @ApiQuery({
    name: "state",
    required: false,
    enum: [...Object.values(ClassState), "ALL"],
    description:
      "Filter by class status. Use 'ALL' to retrieve classes of all statuses",
    example: "ATIVA",
  })
  @ApiResponse({
    status: 200,
    description: "Classes retrieved successfully",
    type: [ClassResponseDTO],
    schema: {
      example: [
        {
          id: 1,
          name: "Advanced Guitar Class",
          activityId: 1,
          levelId: 2,
          state: "ATIVA",
          teachers: [
            { id: 1, fullName: "John Smith" },
            { id: 2, fullName: "Jane Doe" },
          ],
          isRecurrent: true,
          startDate: "2025-03-01",
          endDate: "2025-06-01",
          startTime: "09:00:00",
          endTime: "10:30:00",
          schedules: [
            { id: 1, dayOfWeek: "SEGUNDA" },
            { id: 2, dayOfWeek: "QUARTA" },
            { id: 3, dayOfWeek: "SEXTA" },
          ],
        },
        {
          id: 2,
          name: "Beginner Piano Class",
          activityId: 2,
          levelId: 1,
          state: "ATIVA",
          teachers: [{ id: 3, fullName: "Mary Johnson" }],
          isRecurrent: true,
          startDate: "2025-04-01",
          endDate: null,
          startTime: "14:00:00",
          endTime: "15:30:00",
          schedules: [
            { id: 4, dayOfWeek: "TERCA" },
            { id: 5, dayOfWeek: "QUINTA" },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid query parameters",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            statusCode: { type: "number", example: 400 },
            message: { type: "array", items: { type: "string" } },
            error: { type: "string", example: "Bad Request" },
          },
        },
        examples: {
          invalidClassId: {
            summary: "Invalid classId format",
            value: {
              statusCode: 400,
              message: ["classId must be an integer number"],
              error: "Bad Request",
            },
          },
          invalidState: {
            summary: "Invalid state value",
            value: {
              statusCode: 400,
              message: ["state must be a valid enum value"],
              error: "Bad Request",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
        error: "Failed to retrieve classes",
      },
    },
  })
  async findClasses(
    @Query() filterDto: ClassQueryFilters,
  ): Promise<ClassResponseDTO[]> {
    return await this.classService.findClasses(filterDto);
  }
  @Get("my-classes/:userId")
  @ApiOperation({
    summary: "Get classes assigned to a specific teacher",
    description:
      "Retrieves all classes where the specified user is assigned as a teacher. " +
      "Results can be filtered by class ID, level ID, activity ID, or status.",
  })
  @ApiParam({
    name: "userId",
    type: Number,
    description: "The ID of the teacher/user whose classes to retrieve",
    example: 1,
  })
  @ApiQuery({
    name: "classId",
    required: false,
    type: Number,
    description: "Filter by specific class ID",
    example: 1,
  })
  @ApiQuery({
    name: "levelId",
    required: false,
    type: Number,
    description: "Filter by level ID",
    example: 2,
  })
  @ApiQuery({
    name: "activityId",
    required: false,
    type: Number,
    description: "Filter by activity ID",
    example: 3,
  })
  @ApiQuery({
    name: "state",
    required: false,
    enum: [...Object.values(ClassState), "ALL"],
    description:
      "Filter by class status. Use 'ALL' to retrieve classes of all statuses",
    example: ClassState.ATIVA,
  })
  @ApiResponse({
    status: 200,
    description: "Teacher's classes retrieved successfully",
    type: [ClassResponseDTO],
    schema: {
      example: [
        {
          id: 1,
          name: "Advanced Guitar Class",
          activityId: 1,
          levelId: 2,
          state: "ATIVA",
          teachers: [
            { id: 1, fullName: "John Smith" },
            { id: 2, fullName: "Jane Doe" },
          ],
          isRecurrent: true,
          startDate: "2025-03-01",
          endDate: "2025-06-01",
          startTime: "09:00:00",
          endTime: "10:30:00",
          schedules: [
            { id: 1, dayOfWeek: "SEGUNDA" },
            { id: 2, dayOfWeek: "QUARTA" },
            { id: 3, dayOfWeek: "SEXTA" },
          ],
        },
        {
          id: 3,
          name: "Intermediate Piano Class",
          activityId: 2,
          levelId: 2,
          state: "ATIVA",
          teachers: [{ id: 1, fullName: "John Smith" }],
          isRecurrent: true,
          startDate: "2025-03-10",
          endDate: null,
          startTime: "11:00:00",
          endTime: "12:30:00",
          schedules: [
            { id: 6, dayOfWeek: "TERCA" },
            { id: 7, dayOfWeek: "QUINTA" },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid parameters",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            statusCode: { type: "number", example: 400 },
            message: { type: "array", items: { type: "string" } },
            error: { type: "string", example: "Bad Request" },
          },
        },
        examples: {
          invalidUserId: {
            summary: "Invalid userId format",
            value: {
              statusCode: 400,
              message: ["userId must be a number"],
              error: "Bad Request",
            },
          },
          invalidFilters: {
            summary: "Invalid filter parameters",
            value: {
              statusCode: 400,
              message: [
                "classId must be an integer number",
                "state must be a valid enum value",
              ],
              error: "Bad Request",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
        error: "Failed to retrieve teacher's classes",
      },
    },
  })
  async findMyClasses(
    @Query() filterDto: ClassQueryFilters,
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<ClassResponseDTO[]> {
    return await this.classService.findMyClasses(userId, filterDto);
  }
  @Patch(":classId")
  @ApiOperation({
    summary: "Update an existing class",
    description:
      "Updates class information. All fields are optional. " +
      "Validates level and teacher IDs, time values, and recurrent class rules.",
  })
  @ApiParam({
    name: "classId",
    type: Number,
    description: "Class ID to update",
    example: 1,
  })
  @ApiBody({
    type: UpdateClassDTO,
    examples: {
      updateName: {
        summary: "Update name only",
        value: {
          name: "Advanced Guitar Class - Level 2",
        },
      },
      updateSchedule: {
        summary: "Update schedule",
        value: {
          dayOfWeek: ["SEGUNDA", "QUARTA"],
          startTime: "10:00:00",
          endTime: "11:30:00",
        },
      },
      updateTeachers: {
        summary: "Update teachers",
        value: {
          teacherIds: [3, 4],
        },
      },
      updateState: {
        summary: "Update class state",
        value: {
          state: "ATIVA",
        },
      },
      fullUpdate: {
        summary: "Multiple fields",
        value: {
          name: "Intermediate Piano Class",
          levelId: 2,
          teacherIds: [2, 5],
          startTime: "14:00:00",
          endTime: "15:30:00",
          dayOfWeek: ["TERCA", "QUINTA"],
          state: "ATIVA",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Class updated successfully",
    type: ClassResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: "Validation failed",
    content: {
      "application/json": {
        examples: {
          invalidTeacher: {
            summary: "Invalid teacher ID",
            value: {
              statusCode: 400,
              message:
                "Cannot create class: invalid teacher ID(s) provided: 99",
              error: "Bad Request",
            },
          },
          recurrentWithoutDays: {
            summary: "Missing days for recurrent class",
            value: {
              statusCode: 400,
              message:
                "Cannot create recurrent class: dayOfWeek array cannot be empty when isRecurrent is true",
              error: "Bad Request",
            },
          },
          invalidTime: {
            summary: "Invalid time value",
            value: {
              statusCode: 400,
              message:
                "Cannot update class: invalid start time provided (must be 00:00:00 to 23:59:59)",
              error: "Bad Request",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Resource not found",
    content: {
      "application/json": {
        examples: {
          classNotFound: {
            value: {
              statusCode: 404,
              message: "Class with ID 99 not found",
              error: "Not Found",
            },
          },
          levelNotFound: {
            value: {
              statusCode: 404,
              message: "Level with ID 99 not found",
              error: "Not Found",
            },
          },
        },
      },
    },
  })
  async updateClass(
    @Param("classId", ParseIntPipe) classId: number,
    @Body() updateClassDto: UpdateClassDTO,
  ): Promise<ClassResponseDTO> {
    return await this.classService.update(classId, updateClassDto);
  }

  @Delete(":classId")
  @ApiOperation({
    summary: "Soft delete a class",
    description:
      "Marks the class as INATIVA and sets its endDate to the current date. " +
      "Also updates all related enrollments, ending them at the same date. " +
      "This operation does not physically remove data from the database.",
  })
  @ApiParam({
    name: "classId",
    required: true,
    type: Number,
    description: "ID of the class to be logically deleted",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Class and related enrollments logically deleted successfully",
    type: DeleteClassResponseDTO,
    schema: {
      example: {
        id: 1,
        name: "Advanced Guitar Class",
        status: "INATIVA",
        endDate: "2025-10-26T15:30:00.000Z",
        message:
          "Class deleted logically. All enrollments have been finalized.",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - Class not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Class with ID 99 not found",
        error: "Not Found",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid ID",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            statusCode: { type: "number", example: 400 },
            message: { type: "string" },
            error: { type: "string", example: "Bad Request" },
          },
        },
        examples: {
          invalidId: {
            summary: "Invalid ID parameter",
            value: {
              statusCode: 400,
              message: "Validation failed (numeric string is expected)",
              error: "Bad Request",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Conflict - Class already deleted",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            statusCode: { type: "number", example: 409 },
            message: { type: "string" },
            error: { type: "string", example: "Conflict Exception" },
          },
        },
        examples: {
          invalidId: {
            summary: "Invalid class state",
            value: {
              statusCode: 409,
              message:
                "Class with ID (numeric string is expectd) is already inactive and cannot be deleted again",
              error: "Conflict",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
        error: "Failed to logically delete class",
      },
    },
  })
  async deleteClass(@Param("classId", ParseIntPipe) classId: number) {
    return await this.classService.deleteClass(classId);
  }
}
