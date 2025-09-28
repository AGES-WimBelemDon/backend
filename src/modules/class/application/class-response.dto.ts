
import { ApiProperty } from "@nestjs/swagger";

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

    @ApiProperty({ example: [1], description: "Lista de IDs de professores" })
    teacherIds: number[];
}
