import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { FrequencyStatus } from "../domain/frequency.entity";

export class ActivityResponseDTO {
  @ApiProperty({
    example: 1,
    description: "The ID of the activity",
    nullable: true,
  })
  activityId: number | null;

  @ApiProperty({
    example: "Esportes",
    description: "The name of the activity",
  })
  activityName: string;
}

export class UserClassesDTO {
  @ApiProperty({
    example: 1,
    description: "The ID of the class",
    nullable: true,
  })
  classId: number | null;

  @ApiProperty({
    example: "Tênis I",
    description: "The name of the class",
    nullable: true,
  })
  className: string | null;
  @ApiProperty({
    example: "ATIVA",
    description: "The current state of the class",
  })
  classState: string;

  @ApiProperty({
    example: "Iniciante",
    description: "The level of the class",
    nullable: true,
  })
  levelName: string | null;

  @ApiProperty({
    example: false,
    description:
      "Indicates if this is a general roll call class (always false for specific classes)",
  })
  isGeral: boolean;
  @ApiProperty({
    type: ActivityResponseDTO,
    description: "Details of the activity associated with the class",
  })
  activity: ActivityResponseDTO;
}

export class UserClassesResponseDTO {
  @ApiProperty({
    type: [UserClassesDTO],
    description: "A list of available classes for the user",
  })
  classes: UserClassesDTO[];
}

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
export class StudentClassAttendanceItemDTO {
  @ApiProperty({
    example: 11,
    description: "The unique ID of the frequency record"
  })
  frequencyId: number;

  @ApiProperty({
    example: 1,
    description: "The ID of the student"
  })
  studentId: number;

  @ApiProperty({
    example: "João Silva",
    description: "The student's full name"
  })
  studentFullName: string;

  @ApiProperty({
    example: "90.00%",
    description: "The student's attendance percentage for this class"
  })
  attendancePercentage: string;

  @ApiProperty({
    example: "AUSENTE",
    description: "The attendance status for this specific date",
    enum: ["PRESENTE", "AUSENTE"]
  })
  status: string;

  @ApiProperty({
    example: "ATESTADO-MEDICO",
    description: "Additional notes about the student's attendance",
    nullable: true
  })
  notes: string | null;
}

export class StudentListByClassAndDateResponseDTO {
  @ApiProperty({
    example: 2,
    description: "The ID of the class"
  })
  classId: number;
  
  @ApiProperty({
    example: "2025-09-02",
    description: "The date of the attendance record"
  })
  date: String;
  
  @ApiProperty({
    type: [StudentClassAttendanceItemDTO],
    description: "List of students with their attendance details"
  })
  studentList: StudentClassAttendanceItemDTO[];
}

export class PostClassAttendanceDTO {
  @IsNumber()
  @Type(() => Number)
  classId: number;
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    example: "2025-09-11",
    description: "The attendance class date",
  })
  date: Date;
}
export interface EnrolledStudentDTO {
  id: number;
}

export class UpdateAttendanceItemDTO {
  @ApiProperty({
    example: 19,
    description: "The ID of the frequency record to update"
  })
  @IsNumber()
  @IsNotEmpty()
  frequencyId: number;

  @ApiProperty({
    example: 2,
    description: "The ID of the student"
  })
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({
    example: "PRESENTE",
    description: "The updated attendance status",
    enum: ["PRESENTE", "AUSENTE"]
  })
  @IsEnum(FrequencyStatus)
  @IsNotEmpty()
  status: FrequencyStatus;

  @ApiProperty({
    example: "ATESTADO-MEDICO",
    description: "Additional notes about the attendance",
    nullable: true
  })
  @IsOptional()
  notes: string | null;
}

export class UpdateClassAttendanceRequestDTO {
  @ApiProperty({
    example: 2,
    description: "The ID of the class"
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  classId: number;
  
  @ApiProperty({
    example: "2025-09-11",
    description: "The date of the attendance records"
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
  
  @ApiProperty({
    type: [UpdateAttendanceItemDTO],
    description: "List of student attendance records to update"
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAttendanceItemDTO)
  studentList: UpdateAttendanceItemDTO[];
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