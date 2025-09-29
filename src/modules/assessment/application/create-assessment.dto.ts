import { IsEnum, IsOptional, IsISO8601, IsArray, ArrayNotEmpty, ValidateNested, IsInt, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { FormType } from '@prisma/client';

export class CreateAssessmentDto {
  @IsEnum(FormType)
  formType: FormType;

  @IsOptional()
  submission_date?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers: AnswerItemDto[];
}

export class AnswerItemDto {
  @IsInt()
  id_question: number;

  @IsString()
  @MinLength(1)
  content: string;
}
