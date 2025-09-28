
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateClassDTO {
    @ApiProperty({ example: "Turma de violão", description: "Nome da turma" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 1, description: "ID da atividade" })
    @IsNumber()
    @IsNotEmpty()
    activityId: number;

    @ApiProperty({ example: 1, description: "ID do nível" })
    @IsNumber()
    @IsNotEmpty()
    levelId: number;

    @ApiProperty({ example: "ATIVA", description: "Estado da turma" })
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty({ example: [1, 2, 3], description: "Lista de IDs de alunos", required: false })
    @IsArray()
    @IsOptional()
    studentsIds: number[] |  null

    @ApiProperty({ example: [1], description: "Lista de IDs de professores", required: false })
    @IsArray()
    @IsOptional()
    teacherIds: number[] | null
}
