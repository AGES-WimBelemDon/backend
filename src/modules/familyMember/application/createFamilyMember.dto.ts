import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsInt, IsArray, IsEmail, IsPhoneNumber } from 'class-validator';
import { Race, Gender, EducationLevel, SocialProgram, EmploymentStatus } from '@prisma/client';

export class CreateFamilyMemberDTO {
    @ApiProperty({ example: "Joana Oliveira", description: "Nome completo do membro da família" })
    @IsString()
    @IsNotEmpty({ message: "Nome completo é obrigatório" })
    fullName: string;

    @ApiProperty({ example: "Mãe", description: "Relação de parentesco com o aluno" })
    @IsString()
    @IsNotEmpty({ message: "Parentesco é obrigatório" })
    relationship: string;

    @ApiProperty({ example: "51999999999", description: "Número de telefone" })
    @IsString()
    @IsPhoneNumber("BR", { message: "Número de telefone inválido" })
    @IsNotEmpty({ message: "Número de telefone é obrigatório" })
    phoneNumber: string;

    @ApiProperty({ type: [Number], example: [1], description: "IDs dos estudantes aos quais este membro da família está associado" })
    @IsArray()
    @IsInt({ each: true })
    @IsNotEmpty()
    studentIds: number[];

    @ApiProperty({ example: 100, description: "ID do endereço do membro da família" })
    @IsInt()
    @IsOptional()
    addressId?: number;

    @ApiProperty({ example: "joana.o@email.com", required: false })
    @IsOptional()
    @IsString()
    @IsEmail({},{ message: "Email inválido" })
    email?: string;

    @ApiProperty({ example: "Joana", required: false })
    @IsOptional()
    @IsString()
    socialName?: string;

    @ApiProperty({ enum: Race, required: false })
    @IsOptional()
    @IsEnum(Race)
    race?: Race;

    @ApiProperty({ enum: Gender, required: false })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiProperty({ enum: EducationLevel, required: false })
    @IsOptional()
    @IsEnum(EducationLevel)
    educationLevel?: EducationLevel;

    @ApiProperty({ example: "1980-10-25", required: false })
    @IsOptional()
    @IsDateString({}, { message: "Data de nascimento deve estar no formato YYYY-MM-DD" })
    dateOfBirth?: string;

    @ApiProperty({ enum: SocialProgram, required: false })
    @IsOptional()
    @IsEnum(SocialProgram)
    socialPrograms?: SocialProgram;

    @ApiProperty({ enum: EmploymentStatus, required: false })
    @IsOptional()
    @IsEnum(EmploymentStatus)
    employmentStatus?: EmploymentStatus;
}