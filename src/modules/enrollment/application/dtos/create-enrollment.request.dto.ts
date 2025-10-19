import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsArray, ArrayNotEmpty } from "class-validator";

export class CreateEnrollmentRequestDTO {
  @ApiProperty({
    description: "Class ID",
    example: 45,
  })
  @IsInt()
  classId: number;

  @ApiProperty({
    description: "List of student IDs to be enrolled",
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  studentIds: number[];
}