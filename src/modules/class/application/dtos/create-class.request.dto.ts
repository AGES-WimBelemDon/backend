import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import { DayOfWeek, StudentStatus } from "src/common/enums/domain.enums";
import { transformDateStringToDate } from "src/common/transformers/string.to.date.transformer";

export class CreateClassDTO {
  @ApiProperty({
    example: "Guitar Class",
    description: "Name of the class",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: "Activity ID",
  })
  @IsNumber()
  @IsNotEmpty()
  activityId: number;

  @ApiProperty({
    example: 1,
    description: "Level ID",
  })
  @IsNumber()
  @IsNotEmpty()
  levelId: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: "List of teacher IDs assigned to the class",
    required: false,
    type: [Number],
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  teacherIds?: number[];

  @ApiProperty({
    example: true,
    description:
      "Defines whether the class is recurrent (repeats weekly on specified days)",
  })
  @IsBoolean()
  @IsNotEmpty()
  isRecurrent: boolean;

  @ApiProperty({
    example: "2025-03-01",
    description: "Class start date (YYYY-MM-DD format)",
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    example: "2025-06-01",
    description: "Class end date (optional, YYYY-MM-DD format)",
    required: false,
    type: Date,
    nullable: true,
  })
  @Transform(transformDateStringToDate, { toClassOnly: true })
  @IsOptional()
  @IsDate({ message: "End date must be a valid date (YYYY-MM-DD)" })
  endDate?: Date;

  @ApiProperty({
    example: "09:00:00",
    description: "Class start time (HH:mm:ss format)",
    pattern: "^\\d{2}:\\d{2}:\\d{2}$",
  })
  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: "startTime must be in HH:mm:ss format",
  })
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    example: "10:00:00",
    description: "Class end time (HH:mm:ss format)",
    pattern: "^\\d{2}:\\d{2}:\\d{2}$",
  })
  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: "endTime must be in HH:mm:ss format",
  })
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    example: ["SEGUNDA", "QUARTA", "SEXTA"],
    description:
      "Days of the week when the class occurs (required if isRecurrent is true)",
    enum: DayOfWeek,
    isArray: true,
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsEnum(DayOfWeek, { each: true })
  dayOfWeek?: DayOfWeek[];
}
