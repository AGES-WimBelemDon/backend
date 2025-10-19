import { ApiProperty } from "@nestjs/swagger";
import { StudentEnrollmentDTO, ClassEnrollmentDTO, EnrollmentWarningDTO } from "./common.dto";

export class ReactivateEnrollmentResponseDTO {
  @ApiProperty({ description: "Enrollment ID", example: 3 })
  id: number;

  @ApiProperty({ description: "Student data", type: StudentEnrollmentDTO })
  student: StudentEnrollmentDTO;

  @ApiProperty({ description: "Class data", type: ClassEnrollmentDTO })
  class: ClassEnrollmentDTO;

  @ApiProperty({
    description: "Enrollment date",
    example: "2025-08-01",
  })
  enrollmentDate: string;

  @ApiProperty({
    description: "Enrollment end date",
    example: null,
    nullable: true,
  })
  endDate: string | null;

  @ApiProperty({
    description: "List of warnings",
    type: [EnrollmentWarningDTO],
  })
  warnings: EnrollmentWarningDTO[];
}
