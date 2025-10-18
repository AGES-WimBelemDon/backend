import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsArray,
  IsDateString,
  IsIn,
  IsNumber,
  Matches,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class UpdateClassDTO {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "TENIS-I (Atualizada)" })
  name?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ example: 2 })
  activityId?: number;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ example: 1 })
  levelId?: number;

  @IsOptional()
  @IsIn(["ATIVA", "INATIVA"])
  @ApiPropertyOptional({ example: "INATIVA" })
  state?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false })
  isRecurrent?: boolean;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: "2025-02-01" })
  startDate?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: "" })
  endDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: "startTime deve estar no formato HH:mm:ss",
  })
  @ApiPropertyOptional({ example: "09:00:00" })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: "endTime deve estar no formato HH:mm:ss",
  })
  @ApiPropertyOptional({ example: "10:00:00" })
  endTime?: string;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ example: [2, 5] })
  teachersId?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  schedulesIds: number[];
}
