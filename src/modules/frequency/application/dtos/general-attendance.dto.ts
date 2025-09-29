import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from "class-validator";
import { FrequencyStatus } from "src/common/enums/domain.enums";




export class UpdateGeneralAttendanceItemDTO {
  @ApiProperty({
    example: 1,
    description: "The ID of the student",
    nullable: false,
  })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description:
      "Indicates whether the student's attendance can be registered in the general attendance list. \
  - true: the student can be marked directly in the general attendance list. \
  - false: the student's attendance is controlled by another class and cannot be modified here.",
  })
  generalAttendanceAllowed: boolean;

  @ApiProperty({
    description: "Describes if a student was present or not",
    example: FrequencyStatus.PRESENTE,
  })
  @IsEnum(FrequencyStatus)
  @IsNotEmpty()
  status: FrequencyStatus;
}

export class UpdateGeneralAttendanceRequestDTO {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  date: Date;
  @ApiProperty({
    description: "An array of student attendance updates.",
    type: [UpdateGeneralAttendanceItemDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => UpdateGeneralAttendanceItemDTO)
  studentList: UpdateGeneralAttendanceItemDTO[];
}


export class StudentGeneralAttendanceResponseDTO {
  @ApiProperty({
    example: 1,
    description: "The ID of the student",
    nullable: false,
  })
  @IsInt()
  @IsNotEmpty()
  studentId: number;
  @ApiProperty({
    example: "John Doe",
    description: "The full name of the student",
    nullable: false,
  })
  fullName: string;

  @ApiProperty({
    description:
      "Indicates whether the student's attendance can be registered in the general attendance list. \
  - true: the student can be marked directly in the general attendance list. \
  - false: the student's attendance is controlled by another class and cannot be modified here.",
  })
  generalAttendanceAllowed: boolean;
  @ApiProperty({
    description: "Describes if a student was present or not",
    example: FrequencyStatus.PRESENTE,
  })
  @IsEnum(FrequencyStatus)
  @IsNotEmpty()
  status: FrequencyStatus;
}

export class GeneralAttendanceResponseDTO {
  @ApiProperty({
    example: "2025-09-20",
    description: "The date of the attendance records",
    type: String
  })
  @IsNotEmpty()
  date: string;
  
  @ApiProperty({
    type: [StudentGeneralAttendanceResponseDTO],
    description: "List of students with their attendance details"
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentGeneralAttendanceResponseDTO)
  studentList: StudentGeneralAttendanceResponseDTO[];
}