import { Optional } from "@nestjs/common";

export enum Race {
    WHITE = "Branca",
    BLACK = "Preta",
    BROWN = "Parda",
    YELLOW = "Amarela",
    INDIGENOUS = "Indígena",
    NA = "NA"
}

export enum Gender {
    MALE = "Masculino",
    FEMALE = "Feminino",
    TRANSGENDER_MALE = "Transgênero Masculino",
    TRANSGENDER_FEMALE = "Transgênero Feminino",
    TRANSVESTITE = "Travesti",
    NON_BINARY = "Não Binário",
    OTHER = "Outro",

}

export enum EducationLevel {
    NO_FORMAL_EDUCATION = "Sem escolaridade",
    ALPHABETIZATED = "Alfabetizado",
    ELEMENTARY_INCOMPLETE = "Ensino Fundamental Incompleto",
    ELEMENTARY_COMPLETE = "Ensino Fundamental Completo",
    HIGH_SCHOOL_INCOMPLETE = "Ensino Médio Incompleto",
    HIGH_SCHOOL_COMPLETE = "Ensino Médio Completo",
    HIGHER_EDUCATION_INCOMPLETE = "Ensino Superior Incompleto",
    HIGHER_EDUCATION_COMPLETE = "Ensino Superior Completo",
    POSTGRADUATE = "Pós-Graduação"
}

export enum SocialProgram {
    BOLSA_FAMILIA = "Bolsa Família",
    BCP = "Benefício de Prestação Continuada (BPC)",
    TARIFA_SOCIAL_ENERGIA = "Tarifa Social de Energia Elétrica",
    AUXILIO_GAS = "Auxílio Gás",
    PROGRAMA_ESTADUAL = "Programa Estadual",
    PROGRAMA_MUNICIPAL_VIA_CRAS = "Programa Municipal via CRAS"
}

export enum EmploymentStatus {
    EMPLOYED = "Empregado",
    UNEMPLOYED = "Desempregado",
}

interface familyMemberProps {

    id: number;
    fullName: String,
    phoneNumber: String,
    relationship: String,
    email?: String,
    socialName?: String,
    race?: Race,
    gender?: Gender,
    educationLevel?: EducationLevel,
    dateOfBirth?: Date,
    socialPrograms?: SocialProgram,
    employmentStatus?: EmploymentStatus,
    studentId: number,
    addressId: number
}

export class FamilyMemberEntity {
    private readonly id: number;
    private readonly studentId: number;
    private readonly addressId: number
    private fullName: String;
    private phoneNumber: String;
    private relationship: String;
    private email?: String;
    private socialName?: String;
    private race?: Race;
    private gender?: Gender;
    private educationLevel?: EducationLevel;
    private dateOfBirth?: Date;
    private socialPrograms?: SocialProgram;
    private employmentStatus?: EmploymentStatus;


    constructor(props: familyMemberProps) {
        if (!props.studentId) throw new Error("Student ID is required");
        this.id = props.id;
        this.studentId = props.studentId;
        this.addressId = props.addressId;
        this.fullName = props.fullName;
        this.phoneNumber = props.phoneNumber;
        this.relationship = props.relationship;
        this.email = props.email;
        this.socialName = props.socialName;
        this.race = props.race;
        this.gender = props.gender;
        this.educationLevel = props.educationLevel;
        this.dateOfBirth = props.dateOfBirth;
        this.socialPrograms = props.socialPrograms;
        this.employmentStatus = props.employmentStatus;
    }

    public getId(): number { return this.id; }

    public getStudentId(): number { return this.studentId; }

    public getAddressId(): number { return this.addressId; }

    public getFullName(): String { return this.fullName; }

    public getPhoneNumber(): String { return this.phoneNumber; }

    public getRelationship(): String { return this.relationship; }

    public getEmail(): String | undefined { return this.email; }

    public getSocialName(): String | undefined { return this.socialName; }

    public getRace(): Race | undefined { return this.race; }

    public getGender(): Gender | undefined { return this.gender; }

    public getEducationLevel(): EducationLevel | undefined { return this.educationLevel; }

    public getDateOfBirth(): Date | undefined { return this.dateOfBirth; }

    public getSocialPrograms(): SocialProgram | undefined { return this.socialPrograms; }

    public getEmploymentStatus(): EmploymentStatus | undefined { return this.employmentStatus; }



    public setFullName(fullName: String): void { this.fullName = fullName; }

    public setPhoneNumber(phoneNumber: String): void { this.phoneNumber = phoneNumber; }

    public setRelationship(relationship: String): void { this.relationship = relationship; }

    public setEmail(email: String): void { this.email = email; }

    public setSocialName(socialName: String): void { this.socialName = socialName; }

    public setRace(race: Race): void { this.race = race; }

    public setGender(gender: Gender): void { this.gender = gender; }

    public setEducationLevel(educationLevel: EducationLevel): void { this.educationLevel = educationLevel; }

    public setDateOfBirth(dateOfBirth: Date): void { this.dateOfBirth = dateOfBirth; }

    public setSocialPrograms(socialPrograms: SocialProgram): void { this.socialPrograms = socialPrograms; }

    public setEmploymentStatus(employmentStatus: EmploymentStatus): void { this.employmentStatus = employmentStatus; }
}

