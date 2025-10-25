import { ApiProperty } from "@nestjs/swagger";

export class TeacherResponseDTO {
  @ApiProperty({
    description: "Teacher ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Teacher's full name",
    example: "John Smith",
  })
  fullName: string;
}
