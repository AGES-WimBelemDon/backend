import { ApiProperty } from "@nestjs/swagger";
import { StudentEnrollmentDTO, EnrollmentWarningDTO } from "./common.dto";

export class EnrollmentItemDTO {
  @ApiProperty({ description: "Enrollment ID", example: 1 })
  id: number;

  @ApiProperty({ description: "Student data", type: StudentEnrollmentDTO })
  student: StudentEnrollmentDTO;

  @ApiProperty({
    description: "Enrollment date",
    example: "2025-10-09",
  })
  enrollmentDate: string;

  @ApiProperty({
    description: "Enrollment end date",
    example: null,
    nullable: true,
  })
  endDate: string | null;
}

export class CreateEnrollmentResponseDTO {
  @ApiProperty({ description: "Class ID", example: 45 })
  classId: number;

  @ApiProperty({
    description: "List of created enrollments",
    type: [EnrollmentItemDTO],
  })
  created: EnrollmentItemDTO[];

  @ApiProperty({
    description: "List of warnings",
    type: [EnrollmentWarningDTO],
  })
  warnings: EnrollmentWarningDTO[];
}