import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { transformDateStringToDate } from 'src/common/transformers/string.to.date.transformer';

export class UpdateAnswerItemDto {
  @ApiProperty({
    description: "ID of the answer to update",
    example: 1,
    type: Number,
    required: true,
  })
  @IsInt()
  answerId: number;
  
  @ApiProperty({
    description: "New submission date for the answer (optional)",
    example: "2025-10-18",
    type: Date,
    required: false,
  })
  @IsOptional()
  @Transform(transformDateStringToDate, { toClassOnly: true })
  @IsDate({ message: "Submission date must be a valid date (YYYY-MM-DD)" })
  submissionDate?: Date;
  
  @ApiProperty({
    description: "New content for the answer (optional). Set to null to remove the answer.",
    example: "Updated response to the question.",
    type: String,
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsString()
  content?: string;
}
export class UpdateAnswerBatchDto {
  @ApiProperty({
    description: "Array of answer updates",
    type: [UpdateAnswerItemDto],
    example: [
      {
        answerId: 1,
        content: "Updated answer content",
        submissionDate: "2025-10-18"
      },
      {
        answerId: 2,
        content: null,
      },
      {
        answerId: 3,
        submissionDate: "2025-10-20"
      }
    ],
    required: true
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerItemDto)
  updates: UpdateAnswerItemDto[];
}