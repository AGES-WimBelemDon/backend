import { ApiProperty } from "@nestjs/swagger";
import { TeacherResponseDTO } from "./teacher.response.dto";
import { ClassScheduleResponseDTO } from "./classSchedule.response.dto";

export class ClassResponseDTO {
  @ApiProperty({
    description: "Class ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Class name",
    example: "Guitar Class",
  })
  name: string;

  @ApiProperty({
    description: "Activity ID",
    example: 1,
  })
  activityId: number;

  @ApiProperty({
    description: "Level ID",
    example: 1,
  })
  levelId: number;

  @ApiProperty({
    description: "Class status",
    example: "ATIVO",
  })
  state: string;

  @ApiProperty({
    description: "List of teachers assigned to the class",
    type: [TeacherResponseDTO],
    example: [
      { id: 1, fullName: "John Smith" },
      { id: 2, fullName: "Jane Doe" },
    ],
  })
  teachers: TeacherResponseDTO[];

  @ApiProperty({
    description: "Whether the class is recurrent",
    example: true,
  })
  isRecurrent: boolean;

  @ApiProperty({
    description: "Class start date",
    type: Date,
    example: "2025-03-01",
  })
  startDate: string;

  @ApiProperty({
    description: "Class end date (optional)",
    type: Date,
    nullable: true,
    required: false,
    example: "2025-06-01",
  })
  endDate: string | null;

  @ApiProperty({
    description: "Class start time",
    example: "09:00:00",
  })
  startTime: string;

  @ApiProperty({
    description: "Class end time",
    example: "10:00:00",
  })
  endTime: string;

  @ApiProperty({
    description: "Days of the week when the class occurs",
    type: [ClassScheduleResponseDTO],
    example: [
      { id: 1, dayOfWeek: "SEGUNDA" },
      { id: 2, dayOfWeek: "QUARTA" },
    ],
  })
  schedules: ClassScheduleResponseDTO[];
}
