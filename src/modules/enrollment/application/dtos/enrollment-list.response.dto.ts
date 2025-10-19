import { ApiProperty } from "@nestjs/swagger";
import { StudentEnrollmentDTO, ClassEnrollmentDTO } from "./common.dto";

export class EnrollmentListItemDTO {
  @ApiProperty({ description: "Enrollment ID", example: 1 })
  enrollmentId: number;

  @ApiProperty({ description: "Student data", type: StudentEnrollmentDTO })
  student: StudentEnrollmentDTO;

  @ApiProperty({ description: "Class data", type: ClassEnrollmentDTO })
  class: ClassEnrollmentDTO;

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
  endDate: string
}
