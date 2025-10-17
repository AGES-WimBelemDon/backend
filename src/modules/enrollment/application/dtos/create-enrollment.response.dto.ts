import { ApiProperty } from "@nestjs/swagger";
import { StudentEnrollmentDTO, EnrollmentWarningDTO } from "./common.dto";

export class EnrollmentItemDTO {
  @ApiProperty({ description: "ID da matrícula", example: 1 })
  id: number;

  @ApiProperty({ description: "Dados do aluno", type: StudentEnrollmentDTO })
  student: StudentEnrollmentDTO;

  @ApiProperty({
    description: "Data de matrícula",
    example: "2025-10-09",
  })
  enrollmentDate: string;

  @ApiProperty({
    description: "Data de encerramento da matrícula",
    example: null,
    nullable: true,
  })
  endDate: string | null;
}

export class CreateEnrollmentResponseDTO {
  @ApiProperty({ description: "ID da turma", example: 45 })
  classId: number;

  @ApiProperty({
    description: "Lista de matrículas criadas",
    type: [EnrollmentItemDTO],
  })
  created: EnrollmentItemDTO[];

  @ApiProperty({
    description: "Lista de avisos",
    type: [EnrollmentWarningDTO],
  })
  warnings: EnrollmentWarningDTO[];
}
