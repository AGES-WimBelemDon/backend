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
} from "@nestjs/swagger";
import { EnrollmentService } from "../application/enrollment.service";
import {
  CreateEnrollmentRequestDTO,
  CreateEnrollmentResponseDTO,
  EnrollmentListItemDTO,
  ReactivateEnrollmentResponseDTO,
} from "../application/dtos";

@Controller("enrollments")
@ApiTags("enrollment-resource")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @ApiOperation({
    summary: "Criar matrículas",
    description:
      "Cria uma ou várias matrículas em uma única requisição. Ignora alunos que já possuem matrícula ativa na turma.",
  })
  @ApiBody({
    type: CreateEnrollmentRequestDTO,
    examples: {
      standard: {
        value: {
          classId: 45,
          studentIds: [1, 2, 3],
        },
        summary: "Criar múltiplas matrículas",
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Matrículas criadas com sucesso",
    type: CreateEnrollmentResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: "Turma ou aluno não encontrado",
  })
  async createEnrollments(
    @Body() data: CreateEnrollmentRequestDTO,
  ): Promise<CreateEnrollmentResponseDTO> {
    return await this.enrollmentService.createEnrollments(data);
  }

  @Get()
  @ApiOperation({
    summary: "Listar matrículas com filtros",
    description:
      "Lista matrículas podendo filtrar por turma, aluno, status da matrícula e status do aluno.",
  })
  @ApiQuery({
    name: "classId",
    required: false,
    type: Number,
    description: "Filtrar por ID da turma",
    example: 45,
  })
  @ApiQuery({
    name: "studentId",
    required: false,
    type: Number,
    description: "Filtrar por ID do aluno",
    example: 101,
  })
  @ApiQuery({
    name: "endDateNull",
    required: false,
    type: Boolean,
    description: "true = apenas matrículas ativas, false = todas (default: true)",
    example: true,
  })
  @ApiQuery({
    name: "studentStatus",
    required: false,
    enum: ["ATIVO", "INATIVO", "ALL"],
    description: "Filtrar por status do aluno (default: ALL)",
    example: "ATIVO",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de matrículas",
    type: [EnrollmentListItemDTO],
  })
  async findEnrollments(
    @Query("classId") classId?: string,
    @Query("studentId") studentId?: string,
    @Query("endDateNull") endDateNull?: string,
    @Query("studentStatus") studentStatus?: "ATIVO" | "INATIVO" | "ALL",
  ): Promise<EnrollmentListItemDTO[]> {
    const filters = {
      classId: classId ? parseInt(classId) : undefined,
      studentId: studentId ? parseInt(studentId) : undefined,
      endDateNull: endDateNull !== undefined ? endDateNull === "true" : true,
      studentStatus: studentStatus || "ALL",
    };

    return await this.enrollmentService.findEnrollments(filters);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Reativar matrícula",
    description:
      "Remove o endDate de uma matrícula encerrada para que o aluno volte a participar da turma. Aluno deve estar com status ATIVO.",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "ID da matrícula",
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: "Matrícula reativada com sucesso",
    type: ReactivateEnrollmentResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: "Matrícula não encontrada",
  })
  @ApiResponse({
    status: 400,
    description: "Aluno não está ativo ou matrícula já está ativa",
  })
  @ApiResponse({
    status: 409,
    description: "Aluno já possui matrícula ativa na turma",
  })
  async reactivateEnrollment(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ReactivateEnrollmentResponseDTO> {
    return await this.enrollmentService.reactivateEnrollment(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Soft delete de matrícula",
    description:
      "Define endDate = now() para a matrícula (não remove fisicamente do banco).",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "ID da matrícula",
    example: 3,
  })
  @ApiResponse({
    status: 204,
    description: "Matrícula encerrada com sucesso",
  })
  @ApiResponse({
    status: 404,
    description: "Matrícula não encontrada",
  })
  @ApiResponse({
    status: 400,
    description: "Matrícula já está inativa",
  })
  async softDeleteEnrollment(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    await this.enrollmentService.softDeleteEnrollment(id);
  }
}
