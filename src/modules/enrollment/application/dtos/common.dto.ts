import { ApiProperty } from "@nestjs/swagger";

export class StudentEnrollmentDTO {
  @ApiProperty({ description: "ID do aluno", example: 101 })
  id: number;

  @ApiProperty({ description: "Nome completo do aluno", example: "Maria Souza" })
  fullName: string;

  @ApiProperty({ description: "Status do aluno", example: "ATIVO" })
  status: string;
}

export class ClassEnrollmentDTO {
  @ApiProperty({ description: "ID da turma", example: 45 })
  id: number;

  @ApiProperty({ description: "Nome da turma", example: "TENIS-I" })
  name: string;
}

export class EnrollmentWarningDTO {
  @ApiProperty({ description: "ID do aluno", example: 102 })
  studentId?: number;

  @ApiProperty({
    description: "Código do aviso",
    example: "ALREADY_ACTIVE",
  })
  code: string;

  @ApiProperty({
    description: "Mensagem do aviso",
    example: "Student 102 já possui matrícula ativa na turma 45.",
  })
  message: string;
}
