import { ApiProperty } from "@nestjs/swagger";
import { ClassState } from "src/common/enums/domain.enums";

export class DeleteClassResponseDTO {
  @ApiProperty({
    description: "Class ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Class name",
    example: "Advanced Guitar Class",
  })
  name: string;

  @ApiProperty({
    description: "New state of the class",
    example: "INATIVA",
  })
  state: ClassState;

  @ApiProperty({
    description: "Date when the class and its enrollments were finalized",
    example: "2025-10-26T15:30:00.000Z",
  })
  endDate: string;

  @ApiProperty({
    description: "Confirmation message for the logical deletion",
    example: "Class deleted logically. All enrollments have been finalized.",
  })
  message: string;
}
