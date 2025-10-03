import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStudentRequestDTO } from './create-student.request.dto';
import { 
    IsDate,
    IsEmail, 
    IsOptional, 
    IsString, 
    Matches 
} from 'class-validator';
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

export class UpdateStudentDTO extends PartialType(CreateStudentRequestDTO) {
    @IsOptional()
    @Matches(/^\d{11}$/, { message: 'CPF must have exactly 11 digits' })
    registrationNumber?: string;

    @ApiProperty({
        example: "1990-09-11",
        description: "Date of birth of the family member (YYYY-MM-DD)",
        type: String,
        format: 'date',
    })
    @Transform(({ value }) => {
            if (!value) return null;
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new BadRequestException("Data format invalid, use YYYY-MM-DD");
            }
            return date;
        })
    @IsOptional()
    @IsDate({ message: "Date of birth must be a valid date" })
    dateOfBirth?: Date;

    static validateCPF(registrationNumber: string): boolean {
        return isValidCPF(registrationNumber);
    }
}