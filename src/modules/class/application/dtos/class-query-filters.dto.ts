import { IsOptional, IsInt, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { ClassState } from "src/common/enums/domain.enums";
import { ApiProperty } from "@nestjs/swagger";

export type ClassStateFilter = ClassState | "ALL";

export class ClassQueryFilters {
  @ApiProperty({
    description: "Filter by specific class ID",
    required: false,
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  classId?: number;

  @ApiProperty({
    description: "Filter by level ID",
    required: false,
    type: Number,
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  levelId?: number;

  @ApiProperty({
    description: "Filter by activity ID",
    required: false,
    type: Number,
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  activityId?: number;

  @ApiProperty({
    description: "Filter by class state. Use 'ALL' to retrieve classes of all states",
    required: false,
    default: "ALL",
    enum: [...Object.values(ClassState), "ALL"],
    example: ClassState.ATIVA,
    enumName: "ClassStateFilter",
  })
  @IsOptional()
  @IsEnum([...Object.values(ClassState), "ALL"])
  state?: ClassStateFilter = "ALL";
}