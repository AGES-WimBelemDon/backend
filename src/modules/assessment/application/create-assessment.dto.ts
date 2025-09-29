import { IsEnum, IsOptional, IsISO8601, IsArray, ArrayNotEmpty, ValidateNested, IsUUID, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { FormType } from '@prisma/client';

export class CreateAssessmentDto {
  @IsEnum(FormType)
  formType: FormType;

  @IsOptional()
  @IsISO8601()
  submission_date?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers: AnswerItemDto[];
}

export class AnswerItemDto {
  @IsUUID()
  id_question: string;

  @IsString()
  @MinLength(1)
  content: string;
}
