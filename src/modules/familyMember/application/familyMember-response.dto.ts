import { ApiProperty } from "@nestjs/swagger";
import { 
    EducationLevel, 
    EmploymentStatus, 
    Gender, 
    Race, 
    SocialProgram 
} from "@prisma/client";

export class FamilyMemberResponseDTO {
    @ApiProperty({ example: 1, description: "Unique identifier of the family member" })
    id: number;

    @ApiProperty({ example: "Joana Oliveira", description: "Full name of the family member" })
    fullName: string;
    
    @ApiProperty({ example: "12345678901", description: "CPF of the family member (only numbers)" })
    registrationNumber: string;
    
    @ApiProperty({ example: "1980-10-25T00:00:00.000Z", description: "Family member's date of birth" })
    dateOfBirth: Date;

    @ApiProperty({ example: 100, description: "ID of the family member's address", nullable: true })
    addressId: number | null;

    @ApiProperty({ example: "email123@example.com", description: "Email of the family member", nullable: true })
    email: string | null;

    @ApiProperty({ example: "Joana", description: "Social name of the family member", nullable: true })
    socialName: string | null;

    @ApiProperty({ example: Race.BRANCA, description: "Family member's race", enum: Race, nullable: true })
    race: Race | null;

    @ApiProperty({ example: Gender.FEMININO, description: "Family member's gender", enum: Gender, nullable: true })
    gender: Gender | null; 
    
    @ApiProperty({ example: EducationLevel.SUPERIOR_COMPLETO, description: "Family member's education level", enum: EducationLevel, nullable: true })
    educationLevel: EducationLevel | null;

    @ApiProperty({ example: SocialProgram.BOLSA_FAMILIA, description: "Social programs", enum: SocialProgram, nullable: true })
    socialPrograms: SocialProgram | null;

    @ApiProperty({ example: EmploymentStatus.EMPREGADO, description: "Family member's employment status", enum: EmploymentStatus, nullable: true })
    employmentStatus: EmploymentStatus | null;

    @ApiProperty({ example: "12345678900", description: "NIS number of the family member", nullable: true })
    nis: string | null;
}