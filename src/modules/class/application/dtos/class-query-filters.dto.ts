import { IsOptional, IsInt, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { StudentStatus } from "src/common/enums/domain.enums";
import { ApiProperty } from "@nestjs/swagger";

export type ClassStatusFilter = StudentStatus | "ALL";

export class ClassQueryFilters {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  classId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  levelId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  activityId?: number;

  @ApiProperty({
      description: "Filter by class state",
      required: false,
      default: "ALL",
      enum: [...Object.values(StudentStatus), "ALL"],
    })
  @IsOptional()
  @IsEnum([...Object.values(StudentStatus), "ALL"])
  state?: ClassStatusFilter = "ALL";
}