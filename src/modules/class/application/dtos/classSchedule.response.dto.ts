import { ApiProperty } from "@nestjs/swagger";
import { DayOfWeek } from "src/common/enums/domain.enums";

export class ClassScheduleResponseDTO {
  @ApiProperty({
    description: "Schedule ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Day of the week",
    enum: DayOfWeek,
    example: DayOfWeek.SEGUNDA,
  })
  dayOfWeek: DayOfWeek;
}
