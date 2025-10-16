import { ApiProperty } from "@nestjs/swagger";

export class QuestionsResponseDTO {
  @ApiProperty({
    description: "Unique identifier of the question",
    example: 1,
    type: Number,
    required: true
  })
  questionId: number;

  @ApiProperty({
    description: "ID of the form this question belongs to",
    example: 1,
    type: Number,
    required: true
  })
  formId: number;

  @ApiProperty({
    description: "The question text shown to users",
    example: "How would you rate your overall experience?",
    type: String,
    required: true
  })
  statement: string;

  @ApiProperty({
    description: "Indicates if an answer to this question is mandatory",
    example: true,
    type: Boolean,
    default: false
  })
  isRequired: boolean;
}