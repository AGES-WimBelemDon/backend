import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { FrequencyStatus, NoteTypes } from "src/common/enums/domain.enums";
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
    example: 90.55,
    description: "The student's attendance percentage for this class"
  })
  attendancePercentage: number;

  @ApiProperty({
    example: "AUSENTE",
    description: "The attendance status for this specific date",
    enum: ["PRESENTE", "AUSENTE"]
  })
  status: string;

  @ApiProperty({
    example: NoteTypes.ATESTADO_MEDICO,
    description: "Additional notes about the student's attendance",
    nullable: true,
    enum: NoteTypes
  })
  notes: NoteTypes | null;
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
  date: string;
  
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
    enum: [FrequencyStatus.PRESENTE, FrequencyStatus.AUSENTE],
    nullable: false
  })
  @IsEnum(FrequencyStatus)
  @IsNotEmpty()
  status: FrequencyStatus;

  @ApiProperty({
    example: NoteTypes.ATESTADO_MEDICO,
    description: "Additional notes about the attendance",
    enum: [NoteTypes.SEM_JUSTIFICATIVA,NoteTypes.ATESTADO_MEDICO],
    nullable: true
  })
  @IsEnum(NoteTypes)
  @IsOptional()
  notes: NoteTypes | null;
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