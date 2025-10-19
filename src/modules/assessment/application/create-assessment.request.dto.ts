import {
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsInt,
  IsString,
  MinLength,
  IsDate,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { transformDateStringToDate } from "src/common/transformers/string.to.date.transformer";

export class AnswerItemDto {
  @ApiProperty({
    description: "ID of the question being answered",
    example: 1,
    type: Number,
    required: true,
  })
  @IsInt()
  questionId: number;

  @ApiProperty({
    description: "The student's answer content",
    example: "Yes, the program has significantly improved my self-confidence.",
    type: String,
    minLength: 1,
    required: true,
  })
  @IsString()
  @MinLength(1)
  content: string;
}
export class CreateAssessmentDto {
  @ApiProperty({
    description: "Date when the assessment was submitted",
    example: "2025-10-17",
    type: Date,
    required: true,
  })
  @Transform(transformDateStringToDate, { toClassOnly: true })
  @IsDate({ message: "Submission date must be a valid date (YYYY-MM-DD)" })
  submissionDate: Date;

  @ApiProperty({
    description: "Array of answers submitted by the student",
    type: [AnswerItemDto],
    example: [
      {
        questionId: 1,
        content: "Yes, I have noticed improvement in my communication skills.",
      },
      {
        questionId: 2,
        content: "The individual counseling sessions were most helpful.",
      },
    ],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers: AnswerItemDto[];
}
