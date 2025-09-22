import { ApiProperty } from '@nestjs/swagger';
import { 
    IsString, 
    IsNotEmpty, 
    IsOptional, 
    IsDateString, 
    IsEnum, 
    IsInt, 
    IsArray, 
    IsEmail, 
    IsPhoneNumber, 
    Matches,
    IsDate
} from 'class-validator';
import { 
    Race, 
    Gender,
    EducationLevel,
    SocialProgram,
    EmploymentStatus
} from '@prisma/client';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

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

export class CreateFamilyMemberDTO {
    @ApiProperty({ example: "Joana Oliveira", description: "Family Member's full name" })
    @IsString()
    @IsNotEmpty({ message: "Full name is required" })
    fullName: string;

    @ApiProperty({ example: "Mãe", description: "Relação de parentesco com o aluno" })
    @IsString()
    @IsNotEmpty({ message: "Relationship is required" })
    relationship: string;

    @ApiProperty({ example: "51999999999", description: "Número de telefone" })
    @IsString()
    @IsPhoneNumber("BR", { message: "Invalid phone number" })
    @IsNotEmpty({ message: "Phone number is required" })
    phoneNumber: string;

    @ApiProperty({ type: [Number], example: [1], description: "IDs of the students associated with this family member" })
    @IsArray()
    @IsInt({ each: true })
    @IsNotEmpty({ message: "Student IDs are required" })
    studentIds: number[];

    @ApiProperty({ example: 100, description: "ID of the family member's address" })
    @IsInt()
    @IsOptional()
    addressId?: number;

    @ApiProperty({ example: "joana.o@email.com", required: false })
    @IsOptional()
    @IsString()
    @IsEmail({}, { message: "Invalid email" })
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

    @ApiProperty({
    example: "1990-09-11",
    description: "Date of birth of the family member",
    type: Date,
    format: 'date',
    required: true
})
    @Transform(({ value }) => {
        if (!value) {
            throw new BadRequestException("Date of birth cannot be empty");
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new BadRequestException("Invalid date format");
        }
        return date;
    })
    
    @IsDate({ message: "Date of birth must be a valid date" })
    @IsNotEmpty({ message: "Date of birth is required" })
    dateOfBirth: Date;

    @ApiProperty({ enum: SocialProgram, required: false })
    @IsOptional()
    @IsEnum(SocialProgram)
    socialPrograms?: SocialProgram;

    @ApiProperty({ enum: EmploymentStatus, required: false })
    @IsOptional()
    @IsEnum(EmploymentStatus)
    employmentStatus?: EmploymentStatus;

    @ApiProperty({ 
        example: "12345678900", 
        required: false,
        description: "NIS number of the family member" })
    @IsOptional()
    @IsString()
    nis?: string;

    @ApiProperty({ 
        example: "12345678901", 
        description: "CPF do aluno (apenas números)",
        pattern: "^[0-9]{11}$"
    })
    @IsString()
    @IsNotEmpty({ message: "CPF é obrigatório" })
    @Matches(/^[0-9]{11}$/, { message: "CPF deve conter exatamente 11 dígitos numéricos" })
    registrationNumber: string;

    static validateCPF(registrationNumber: string): boolean {
        return isValidCPF(registrationNumber);
    }
}