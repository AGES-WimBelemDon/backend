import { ApiProperty } from "@nestjs/swagger";


export class AssessmentResponseDto{
  @ApiProperty({
    description: "Unique identifier of the answer",
    example: 10,
    type: Number
  })
  answerId: number;

  @ApiProperty({
    description: "ID of the student who provided the answer",
    example: 3,
    type: Number
  })
  studentId: number;

  @ApiProperty({
    description: "ID of the question being answered",
    example: 2,
    type: Number
  })
  questionId: number;

  @ApiProperty({
    description: "The content of the answer provided by the student",
    example: "The individual counseling sessions were most helpful.",
    type: String
  })
  content: string;

  @ApiProperty({
    description: "Date when the answer was submitted",
    example: "2025-10-18",
    type: String,
    format: "date"
  })
  submissionDate: string;
}