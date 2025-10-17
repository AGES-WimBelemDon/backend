import { ApiProperty } from "@nestjs/swagger";
import { StudentEnrollmentDTO, ClassEnrollmentDTO, EnrollmentWarningDTO } from "./common.dto";

export class ReactivateEnrollmentResponseDTO {
  @ApiProperty({ description: "ID da matrícula", example: 3 })
  id: number;

  @ApiProperty({ description: "Dados do aluno", type: StudentEnrollmentDTO })
  student: StudentEnrollmentDTO;

  @ApiProperty({ description: "Dados da turma", type: ClassEnrollmentDTO })
  class: ClassEnrollmentDTO;

  @ApiProperty({
    description: "Data de matrícula",
    example: "2025-08-01",
  })
  enrollmentDate: string;

  @ApiProperty({
    description: "Data de encerramento da matrícula",
    example: null,
    nullable: true,
  })
  endDate: string | null;

  @ApiProperty({
    description: "Lista de avisos",
    type: [EnrollmentWarningDTO],
  })
  warnings: EnrollmentWarningDTO[];
}
