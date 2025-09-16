import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsDateString, Matches, MinLength, MaxLength } from "class-validator";

function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11) return false;
    
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

export class CreateStudentDTO {
    @ApiProperty({ 
        example: "João Silva Santos", 
        description: "Nome completo do aluno",
        minLength: 2,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty({ message: "Nome completo é obrigatório" })
    @MinLength(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    @MaxLength(100, { message: "Nome deve ter no máximo 100 caracteres" })
    fullName: string;

    @ApiProperty({ 
        example: "12345678901", 
        description: "CPF do aluno (apenas números)",
        pattern: "^[0-9]{11}$"
    })
    @IsString()
    @IsNotEmpty({ message: "CPF é obrigatório" })
    @Matches(/^[0-9]{11}$/, { message: "CPF deve conter exatamente 11 dígitos numéricos" })
    registrationNumber: string;

    @ApiProperty({ 
        example: "2010-05-15", 
        description: "Data de nascimento do aluno (formato YYYY-MM-DD)",
        required: false
    })
    @IsOptional()
    @IsDateString({}, { message: "Data de nascimento deve estar no formato YYYY-MM-DD" })
    dateOfBirth?: string;

    @ApiProperty({ 
        example: "João", 
        description: "Nome social do aluno",
        required: false,
        maxLength: 50
    })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: "Nome social deve ter no máximo 50 caracteres" })
    socialName?: string;

    static validateCPF(registrationNumber: string): boolean {
        return isValidCPF(registrationNumber);
    }
}
