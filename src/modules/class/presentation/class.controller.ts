import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from "@nestjs/swagger";
import { ClassService } from "../application/class.service";
import { CreateClassDTO } from "../application/dtos/create-class.request.dto";
import { ClassQueryFilters, ClassResponseDTO } from "../application/dtos";
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ClassState } from "src/common/enums/domain.enums";
import { UpdateClassDTO } from "../application/dtos/update-class.dto";

@ApiTags("classes")
@Controller("classes")
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
    description: "Filter by class status. Use 'ALL' to retrieve classes of all statuses",
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
              message: [
                "classId must be an integer number",
              ],
              error: "Bad Request",
            },
          },
          invalidState: {
            summary: "Invalid state value",
            value: {
              statusCode: 400,
              message: [
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
        error: "Failed to retrieve classes",
      },
    },
  })
  async findClasses(
    @Query() filterDto: ClassQueryFilters
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
    description: "Filter by class status. Use 'ALL' to retrieve classes of all statuses",
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
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<ClassResponseDTO[]> {
    return await this.classService.findMyClasses(userId, filterDto);
  }
  @Patch(':classId')
  async updateStudent(
    @Param('classId', ParseIntPipe) classId: number,
    @Body() updateStudentDto: UpdateClassDTO,
  ): Promise<void> {
  await this.classService.update(classId, updateStudentDto);
  }
}
