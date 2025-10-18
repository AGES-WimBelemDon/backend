import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

export class CreateClassDTO {
  @ApiProperty({ example: "Turma de violão", description: "Nome da turma" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: "ID da atividade" })
  @IsNumber()
  @IsNotEmpty()
  activityId: number;

  @ApiProperty({ example: 1, description: "ID do nível" })
  @IsNumber()
  @IsNotEmpty()
  levelId: number;

  @ApiProperty({ example: "ATIVA", description: "Estado da turma" })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    example: [1],
    description: "Lista de IDs de professores",
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  teacherIds: number[] | undefined;

  @ApiProperty({ example: true, description: "Define se a turma é recorrente" })
  @IsBoolean()
  @IsNotEmpty()
  isRecurrent: boolean;

  @ApiProperty({
    example: "2025-03-01",
    description: "Data de início da turma",
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    example: "2025-06-01",
    description: "Data de término da turma (opcional)",
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    example: "09:00:00",
    description: "Horário de início das aulas (formato HH:mm:ss)",
  })
  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: "startTime deve estar no formato HH:mm:ss",
  })
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    example: "10:00:00",
    description: "Horário de término das aulas (formato HH:mm:ss)",
  })
  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: "endTime deve estar no formato HH:mm:ss",
  })
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    example: [1, 2],
    description: "IDs dos horários associados à turma",
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsNotEmpty()
  schedulesIds: number[];
}
