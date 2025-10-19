import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt, IsBoolean, IsEnum } from "class-validator";
import { Transform, Type } from "class-transformer";
import { StudentStatus } from "src/common/enums/domain.enums";

export type StudentStatusFilter = StudentStatus | "ALL";

export class EnrollmentQueryFilterDto {
  @ApiProperty({
    description: "Filter by class ID",
    required: false,
    type: Number,
    example: 45,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  classId?: number;

  @ApiProperty({
    description: "Filter by student ID",
    required: false,
    type: Number,
    example: 101,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  studentId?: number;

  @ApiProperty({
    description: "true = only active enrollments, false = all enrollments",
    required: false,
    default: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined) return true;
    return value === "true" || value === true;
  })
  endDateNull?: boolean = true;

  @ApiProperty({
    description: "Filter by student status",
    required: false,
    default: "ALL",
    enum: [...Object.values(StudentStatus), "ALL"],
  })
  @IsOptional()
  @IsEnum([...Object.values(StudentStatus), "ALL"])
  studentStatus?: StudentStatusFilter = "ALL";
}
