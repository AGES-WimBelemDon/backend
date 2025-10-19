import { ApiProperty } from "@nestjs/swagger";
import { StudentEnrollmentDTO, ClassEnrollmentDTO } from "./common.dto";

export class EnrollmentListItemDTO {
  @ApiProperty({ description: "ID da matrícula", example: 1 })
  enrollmentId: number;

  @ApiProperty({ description: "Dados do aluno", type: StudentEnrollmentDTO })
  student: StudentEnrollmentDTO;

  @ApiProperty({ description: "Dados da turma", type: ClassEnrollmentDTO })
  class: ClassEnrollmentDTO;

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
