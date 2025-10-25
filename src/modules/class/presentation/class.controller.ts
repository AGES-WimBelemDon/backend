import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { ClassService } from "../application/class.service";
import { CreateClassDTO } from "../application/dtos/create-class.request.dto";
import { ClassResponseDTO } from "../application/dtos";
import { Body, Controller, Post } from "@nestjs/common";

@ApiTags("class")
@Controller("class")
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
          state: "ATIVO",
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
          state: "ATIVO",
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
          state: "ATIVO",
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
        state: "ATIVO",
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
}
