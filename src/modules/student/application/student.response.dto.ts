import { ApiProperty } from "@nestjs/swagger";
import {
  Gender,
  Race,
  SchoolYear,
  SocialProgram,
  EmploymentStatus,
  StudentStatus,
} from "src/common/enums/domain.enums";

export class StudentResponseDTO {
  @ApiProperty({ example: 1, description: "Student's unique ID" })
  id: number;

  @ApiProperty({
    example: "John Smith Santos",
    description: "Student's full name",
  })
  fullName: string;

  @ApiProperty({
    example: "12345678901",
    description: "Student's CPF (registration number)",
  })
  registrationNumber: string;

  @ApiProperty({
    example: "2023-01-15",
    description: "Date when student enrolled",
  })
  enrollmentDate: Date;

  @ApiProperty({
    example: null,
    description: "Date when student left the program",
    nullable: true,
  })
  disenrollmentDate: Date | null;

  @ApiProperty({
    example: "ATIVO",
    enum: StudentStatus,
    description: "Current student status",
  })
  status: StudentStatus;

  @ApiProperty({
    example: "1990-09-11",
    description: "Student's date of birth",
    nullable: true,
  })
  dateOfBirth: Date | null;

  @ApiProperty({
    example: "João",
    description: "Student's social name",
    nullable: true,
  })
  socialName: string | null;

  @ApiProperty({
    example: "PRETA",
    enum: Race,
    description: "Student's self-identified race",
    nullable: true,
  })
  race: Race | null;

  @ApiProperty({
    example: "MASCULINO",
    enum: Gender,
    description: "Student's gender identity",
    nullable: true,
  })
  gender: Gender | null;

  @ApiProperty({
    example: 2,
    description: "Student's educational level ID",
    nullable: true,
  })
  levelId: number | null;

  @ApiProperty({
    example: "Escola Municipal João da Silva",
    description: "Name of student's school",
    nullable: true,
  })
  schoolName: string | null;

  @ApiProperty({
    example: "Matutino",
    description: "Student's school shift",
    nullable: true,
  })
  schoolShift: string | null;

  @ApiProperty({
    example: "ENSINO_MEDIO_1",
    enum: SchoolYear,
    description: "Student's current school year",
    nullable: true,
  })
  schoolYear: SchoolYear | null;

  @ApiProperty({
    example: true,
    description: "Indicates if student has a grade gap (defasagem escolar)",
    nullable: true,
  })
  gradeGap: boolean | null;

  @ApiProperty({
    example: "BOLSA_FAMILIA",
    enum: SocialProgram,
    description: "Social programs the student participates in",
    nullable: true,
  })
  socialPrograms: SocialProgram | null;

  @ApiProperty({
    example: "DESEMPREGADO",
    enum: EmploymentStatus,
    description: "Student's employment status",
    nullable: true,
  })
  employmentStatus: EmploymentStatus | null;

  @ApiProperty({
    example: 100,
    description: "ID of student's address record",
    nullable: true,
  })
  addressId: number | null;
}
