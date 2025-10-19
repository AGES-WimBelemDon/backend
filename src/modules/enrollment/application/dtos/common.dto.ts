import { ApiProperty } from "@nestjs/swagger";

export class StudentEnrollmentDTO {
  @ApiProperty({ description: "Student ID", example: 101 })
  id: number;

  @ApiProperty({ description: "Student's full name", example: "Maria Souza" })
  fullName: string;

  @ApiProperty({ description: "Student status", example: "ATIVO" })
  status: string;
}

export class ClassEnrollmentDTO {
  @ApiProperty({ description: "Class ID", example: 45 })
  id: number;

  @ApiProperty({ description: "Class name", example: "TENIS-I" })
  name: string;
}

export class EnrollmentWarningDTO {
  @ApiProperty({ description: "Student ID", example: 102 })
  studentId?: number;

  @ApiProperty({
    description: "Warning code",
    example: "ALREADY_ACTIVE",
  })
  code: string;

  @ApiProperty({
    description: "Warning message",
    example: "Student 102 already has an active enrollment in class 45.",
  })
  message: string;
}