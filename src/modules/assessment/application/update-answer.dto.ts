import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsInt, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { transformDateStringToDate } from 'src/common/transformers/string.to.date.transformer';

export class UpdateAnswerDto {
  @IsString()
  @MinLength(1)
  content: string;
}

export class UpdateAnswerBatchDto {
  
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerItemDto)
  updates: UpdateAnswerItemDto[];

}
export class UpdateAnswerItemDto{
  @ApiProperty({
    description: "ID of the question being answered",
    example: 1,
    type: Number,
    required: true,
  })
  @IsInt()
  answerId: number;
  
  @IsOptional()
  @Transform(transformDateStringToDate, { toClassOnly: true })
  @IsDate({ message: "Submission date must be a valid date (YYYY-MM-DD)" })
  submissionDate?: Date;
  
  @IsOptional()
  content?: string
}
