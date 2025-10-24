import { ApiProperty } from "@nestjs/swagger";
import { ClassSchedule } from "../domain/class-schedule";
import { Teacher } from "../domain/teacher";

export class ClassResponseDTO {
  @ApiProperty({ example: 1, description: "ID único da turma" })
  id: number;

  @ApiProperty({ example: "Turma de violão", description: "Nome da turma" })
  name: string;

  @ApiProperty({ example: 1, description: "ID da atividade" })
  activityId: number;

  @ApiProperty({ example: 1, description: "ID do nível" })
  levelId: number;

  @ApiProperty({ example: "ATIVA", description: "Estado da turma" })
  state: string;

  @ApiProperty({ example: [1, 2, 3], description: "Lista de IDs de alunos" })
  studentsIds: number[];

  @ApiProperty({ example: true, description: "Define se a turma é recorrente" })
  isRecurrent: boolean;

  @ApiProperty({
    example: "2025-03-01",
    description: "Data de início da turma",
  })
  startDate: Date;

  @ApiProperty({
    example: "2025-06-01",
    description: "Data de término da turma (opcional)",
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    example: "2025-03-01T08:00:00.000Z",
    description: "Horário de início das aulas",
  })
  startTime: Date;

  @ApiProperty({
    example: "2025-03-01T10:00:00.000Z",
    description: "Horário de término das aulas",
  })
  endTime: Date;

  @ApiProperty({
    example: [
      { id: 10, classId: 1, dayOfWeek: "SEGUNDA" },
      { id: 11, classId: 1, dayOfWeek: "QUARTA" },
    ],
    description: "Horários associados à turma",
  })
  schedules: ClassSchedule[];

  @ApiProperty({
    example: [
      [
        { id: 1, fullName: "João da Silva" },
        { id: 2, fullName: "José Santos" },
      ],
    ],
    description: "Lista de professores",
  })
  teachers: Teacher[];
}
