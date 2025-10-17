import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsArray, ArrayNotEmpty } from "class-validator";

export class CreateEnrollmentRequestDTO {
  @ApiProperty({
    description: "ID da turma",
    example: 45,
  })
  @IsInt()
  classId: number;

  @ApiProperty({
    description: "Lista de IDs dos alunos a serem matriculados",
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  studentIds: number[];
}
