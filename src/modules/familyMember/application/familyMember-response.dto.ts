import { ApiProperty } from "@nestjs/swagger";
import { 
    EducationLevel, 
    EmploymentStatus, 
    Gender, 
    Race, 
    SocialProgram 
} from "@prisma/client";

export class FamilyMemberResponseDTO {
    @ApiProperty({ 
        example: 1, 
        description: "Unique identifier of the family member" 
    })
    id: number;

    @ApiProperty({ 
        example: "Joana Oliveira", 
        description: "Full name of the family member" 
    })
    fullName: string;

    @ApiProperty({ 
        example: "Mãe", 
        description: "Relationship to the student" 
    })
    relationship: string;

    @ApiProperty({ 
        example: "51999999999", 
        description: "Phone number of the family member" 
    })
    phoneNumber: string;

    @ApiProperty({ 
        type: [Number], 
        example: [1], 
        description: "IDs of students associated with this family member" 
    })
    studentIds: number[];

    @ApiProperty({ 
        example: 100, 
        description: "ID of the family member's address",
        required: false
    })
    addressId?: number;

    @ApiProperty({ 
        example: "email123@example.com", 
        description: "Email of the family member",
        required: false
    })
    email?: string;

    @ApiProperty({ 
        example: "Joana", 
        description: "Social name of the family member",
        required: false
    })
    socialName?: string;

    @ApiProperty({ 
        example: Race.BRANCA, 
        description: "Family member's race",
        required: false,
        enum: Race
    })
    race?: Race;

    @ApiProperty({ 
        example: Gender.FEMININO, 
        description: "Family member's gender",
        required: false,
        enum: Gender
    })
    gender?: Gender;
    
    @ApiProperty({ 
        example: EducationLevel.SUPERIOR_COMPLETO, 
        description: "Family member's education level",
        required: false,
        enum: EducationLevel
    })
    educationLevel?: EducationLevel;

    @ApiProperty({ 
        example: "1980-10-25T00:00:00.000Z", 
        description: "Family member's date of birth",
        required: false
    })
    dateOfBirth?: Date;

    @ApiProperty({ 
        example: SocialProgram.BOLSA_FAMILIA, 
        description: "Social programs the family member is enrolled in",
        required: false,
        enum: SocialProgram
    })
    socialPrograms?: SocialProgram;

    @ApiProperty({ 
        example: EmploymentStatus.EMPREGADO, 
        description: "Family member's employment status",
        required: false,
        enum: EmploymentStatus
    })
    employmentStatus?: EmploymentStatus;

    @ApiProperty({ 
        example: "12345678900", 
        description: "NIS number of the family member",
        required: false
    })
    nis?: string;

    @ApiProperty({ 
        example: "12345678901", 
        description: "CPF of the family member (only numbers)" 
    })
    registrationNumber: string;
}   