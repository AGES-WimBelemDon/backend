import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { EnrollmentService } from "../application/enrollment.service";
import {
  CreateEnrollmentRequestDTO,
  CreateEnrollmentResponseDTO,
  EnrollmentListItemDTO,
  ReactivateEnrollmentResponseDTO,
} from "../application/dtos";
import { EnrollmentQueryFilterDto } from "../application/dtos/enrollment-query.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("enrollments")
@ApiTags("enrollment-resource")
@ApiBearerAuth("JWT-auth")
@Roles(Role.admin, Role.manager, Role.psychologist, Role.social_worker, Role.teacher)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @ApiOperation({
    summary: "Create enrollments",
    description:
      "Creates one or more enrollments in a single request. Ignores students who already have an active enrollment in the class.",
  })
  @ApiBody({
    type: CreateEnrollmentRequestDTO,
    examples: {
      standard: {
        value: {
          classId: 45,
          studentIds: [1, 2, 3],
        },
        summary: "Create multiple enrollments",
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Enrollments created successfully",
    type: CreateEnrollmentResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: "Class or student not found",
  })
  async createEnrollments(
    @Body() data: CreateEnrollmentRequestDTO,
  ): Promise<CreateEnrollmentResponseDTO> {
    return await this.enrollmentService.createEnrollments(data);
  }

  @Get()
  @Roles(Role.psychology_intern, Role.social_work_intern)
  @ApiOperation({
    summary: "List enrollments with filters",
    description:
      "Lists enrollments with filtering options by class, student, enrollment status, and student status.",
  })
  @ApiQuery({
    name: "classId",
    required: false,
    type: Number,
    description: "Filter by class ID",
    example: 45,
  })
  @ApiQuery({
    name: "studentId",
    required: false,
    type: Number,
    description: "Filter by student ID",
    example: 101,
  })
  @ApiQuery({
    name: "endDateNull",
    required: false,
    type: Boolean,
    description: "true = only active enrollments, false = all enrollments (default: true)",
    example: true,
  })
  @ApiQuery({
    name: "studentStatus",
    required: false,
    enum: ["ATIVO", "INATIVO", "ALL"],
    description: "Filter by student status (default: ALL)",
    example: "ATIVO",
  })
  @ApiResponse({
    status: 200,
    description: "List of enrollments",
    type: [EnrollmentListItemDTO],
  })
  async findEnrollments(
    @Query() filterDto: EnrollmentQueryFilterDto
  ): Promise<EnrollmentListItemDTO[]> {
    return await this.enrollmentService.findEnrollments(filterDto);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Reactivate enrollment",
    description:
      "Removes the endDate from a terminated enrollment so the student can rejoin the class. Student must have ACTIVE status.",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Enrollment ID",
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: "Enrollment successfully reactivated",
    type: ReactivateEnrollmentResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: "Enrollment not found",
  })
  @ApiResponse({
    status: 400,
    description: "Student is not active or enrollment is already active",
  })
  @ApiResponse({
    status: 409,
    description: "Student already has an active enrollment in the class",
  })
  async reactivateEnrollment(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ReactivateEnrollmentResponseDTO> {
    return await this.enrollmentService.reactivateEnrollment(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Soft delete enrollment",
    description:
      "Sets endDate to current date for the enrollment (does not physically remove it from the database).",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Enrollment ID",
    example: 3,
  })
  @ApiResponse({
    status: 204,
    description: "Enrollment successfully terminated",
  })
  @ApiResponse({
    status: 404,
    description: "Enrollment not found",
  })
  @ApiResponse({
    status: 400,
    description: "Enrollment is already inactive",
  })
  async softDeleteEnrollment(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    await this.enrollmentService.softDeleteEnrollment(id);
  }
}
