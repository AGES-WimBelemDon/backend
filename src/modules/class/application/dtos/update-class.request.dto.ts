import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { CreateClassDTO } from "./create-class.request.dto";
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotIn,
  IsNumber,
  IsOptional,
  ValidateIf,
} from "class-validator";
import { Transform } from "class-transformer";
import { ClassState, DayOfWeek } from "src/common/enums/domain.enums";
import { transformDateStringToDate } from "src/common/transformers/string.to.date.transformer";

export class UpdateClassDTO extends PartialType(CreateClassDTO) {
  @ApiProperty({
    example: "2025-06-01",
    description: "Class end date (set to null to clear)",
    required: false,
    type: Date,
    nullable: true,
  })
  @Transform(transformDateStringToDate, { toClassOnly: true })
  @IsOptional()
  @ValidateIf((o) => o.endDate !== null)
  @IsDate({ message: "End date must be a valid date (YYYY-MM-DD)" })
  endDate?: Date;

  @ApiProperty({
    example: [1, 2, 3],
    description: "Teacher IDs (empty array to clear all teachers)",
    required: false,
    type: [Number],
    isArray: true,
    nullable: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  teacherIds?: number[];

  @ApiProperty({
    example: ["SEGUNDA", "QUARTA"],
    description: "Days of week (empty array to clear schedules)",
    enum: DayOfWeek,
    isArray: true,
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  dayOfWeek?: DayOfWeek[];

  @ApiProperty({
    example: "ATIVA",
    description: "Class status. Cannot be set to INATIVA - use DELETE endpoint to deactivate classes",
    enum: ClassState,
    required: false,
  })
  @IsOptional()
  @IsEnum(ClassState)
  @IsNotIn([ClassState.INATIVA], {
    message: "Cannot set class to INATIVA through update. Use DELETE endpoint to deactivate classes",
  })
  state?: ClassState;
}