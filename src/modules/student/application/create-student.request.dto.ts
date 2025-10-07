import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    MinLength, 
    MaxLength, 
    IsInt, 
    IsDate,
    Validate,
    IsEnum,
    IsBoolean,
    IsArray
} from "class-validator";
import { 
    Gender, 
    Race, 
    SchoolYear, 
    SocialProgram, 
    EmploymentStatus 
} from "src/common/enums/domain.enums";
import { CPFValidator } from "src/common/validator/CpfValidator";

export class CreateStudentRequestDTO {
    @ApiProperty({ 
        example: "John Smith Santos", 
        description: "Student's full name",
        minLength: 2,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty({ message: "Full name iCreateStudentDTOs required" })
    @MinLength(2, { message: "Name must be at least 2 characters long" })
    @MaxLength(100, { message: "Name must be at most 100 characters long" })
    fullName: string;

    @ApiProperty({ 
        example: "12345678901", 
        description: "CPF of student (numbers only)",
        pattern: "^[0-9]{11}$"
    })
    @IsString()
    @IsNotEmpty({ message: "CPF is required" })
    @Validate(CPFValidator)
    registrationNumber: string;

    @ApiProperty({
        example: "1990-09-11",
        description: "Date of birth of the student",
        type: String,
        format: 'date',
        required: false
    })    
    @Transform(({ value }) => {
        if (!value) return null;
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new BadRequestException("Invalid date format, use YYYY-MM-DD");
        }
        return date;
    })
    @IsOptional()
    @IsDate({ message: "Date of birth must be a valid date" })
    dateOfBirth?: Date;

    @ApiProperty({ 
        example: 100, 
        description: "ID of student's address", 
        required: false 
    })
    @IsInt()
    @IsOptional()
    addressId?: number;

    @ApiProperty({ 
        example: "João", 
        description: "Student's social name",
        required: false,
        maxLength: 50
    })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: "Social name must be at most 50 characters long" })
    socialName?: string;

    @ApiProperty({
        example: Race.PRETA,
        description: "The student's self-identified race",
        enum: Race,
        required: false
    })
    @IsOptional()
    @IsEnum(Race)
    race?: Race;

    @ApiProperty({
        example: Gender.MASCULINO,
        description: "The student's gender identity",
        enum: Gender,
        required: false
    })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiProperty({ 
        example: 1, 
        description: "ID of the student's educational level", 
        required: false 
    })
    @IsInt()
    @IsOptional()
    levelId?: number;

    @ApiProperty({ 
        example: "Escola Municipal João da Silva", 
        description: "Name of the student's school",
        required: false,
        maxLength: 100
    })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: "School name must be at most 100 characters long" })
    schoolName?: string;

    @ApiProperty({ 
        example: "Matutino", 
        description: "Student's school shift (morning, afternoon, evening)",
        required: false,
        maxLength: 20
    })
    @IsOptional()
    @IsString()
    @MaxLength(20, { message: "School shift must be at most 20 characters long" })
    schoolShift?: string;

    @ApiProperty({
        example: SchoolYear.ENSINO_MEDIO_1,
        description: "Student's current school year/grade",
        enum: SchoolYear,
        required: false
    })
    @IsOptional()
    @IsEnum(SchoolYear)
    schoolYear?: SchoolYear;

    @ApiProperty({ 
        example: true, 
        description: "Indicates if the student has a grade gap (defasagem escolar)", 
        required: false 
    })
    @IsOptional()
    @IsBoolean()
    gradeGap?: boolean;

    @ApiProperty({
        example: SocialProgram.BOLSA_FAMILIA,
        description: "Social programs the student's family participates in",
        enum: SocialProgram,
        required: false
    })
    @IsOptional()
    @IsEnum(SocialProgram)
    socialPrograms?: SocialProgram;

    @ApiProperty({
        example: EmploymentStatus.DESEMPREGADO,
        description: "Student's employment status",
        enum: EmploymentStatus,
        required: false
    })
    @IsOptional()
    @IsEnum(EmploymentStatus)
    employmentStatus?: EmploymentStatus;
    @ApiProperty({
        type: [Number],
        description: "List of family members related to the student"
      })
    @IsOptional()
    @IsArray()
    @Type(() => Number)
    familyMembersId: number[];
}