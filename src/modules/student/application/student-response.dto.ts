import { ApiProperty } from "@nestjs/swagger";

export class StudentResponseDTO {
    @ApiProperty({ 
        example: 1, 
        description: "ID único do aluno" 
    })
    id: number;

    @ApiProperty({ 
        example: "João Silva Santos", 
        description: "Nome completo do aluno" 
    })
    fullName: string;

    @ApiProperty({ 
        example: "12345678901", 
        description: "CPF do aluno" 
    })
    registrationNumber: string;

    @ApiProperty({ 
        example: "2010-05-15T00:00:00.000Z", 
        description: "Data de nascimento do aluno",
        required: false
    })
    dateOfBirth?: Date;

    @ApiProperty({ 
        example: "João", 
        description: "Nome social do aluno",
        required: false
    })
    socialName?: string;

    @ApiProperty({ 
        example: "2025-09-07T15:30:00.000Z", 
        description: "Data de matrícula no sistema" 
    })
    enrollmentDate: Date;

    @ApiProperty({ 
        example: "ATIVO", 
        description: "Status do aluno no sistema" 
    })
    status: string;
}
