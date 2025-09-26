import { Race, Gender, EducationLevel, SocialProgram, EmploymentStatus } from "@prisma/client";

interface familyMemberProps {

    id?: number;
    fullName: string,
    phoneNumber: string,
    relationship: string,
    email?: string,
    socialName?: string,
    race?: Race,
    gender?: Gender,
    educationLevel?: EducationLevel,
    dateOfBirth: Date,
    socialPrograms?: SocialProgram,
    employmentStatus?: EmploymentStatus,
    nis?: string,
    registrationNumber: string,
    studentIds: number[],
    addressId?: number | null,
}

export class FamilyMemberEntity {
    private readonly id?: number;
    private fullName: string;
    private phoneNumber: string;
    private relationship: string;
    private email?: string;
    private socialName?: string;
    private race?: Race;
    private gender?: Gender;
    private educationLevel?: EducationLevel;
    private dateOfBirth: Date;
    private socialPrograms?: SocialProgram;
    private employmentStatus?: EmploymentStatus;
    private nis?: string;
    private registrationNumber: string;
    private studentIds: number[];
     private addressId?: number | null;

    constructor(props: familyMemberProps) {
        this.id = props.id;
        this.studentIds = props.studentIds;
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
        this.nis = props.nis;
        this.registrationNumber = props.registrationNumber;
    }

    public getId(): number | undefined { return this.id; }

    public getStudentIds(): number[] { return this.studentIds; }

    public getAddressId(): number | null | undefined { return this.addressId; }

    public getFullName(): string { return this.fullName; }

    public getPhoneNumber(): string { return this.phoneNumber; }

    public getRelationship(): string { return this.relationship; }

    public getEmail(): string | undefined { return this.email; }

    public getSocialName(): string | undefined { return this.socialName; }

    public getRace(): Race | undefined { return this.race; }

    public getGender(): Gender | undefined { return this.gender; }

    public getEducationLevel(): EducationLevel | undefined { return this.educationLevel; }

    public getDateOfBirth(): Date{ return this.dateOfBirth; }

    public getNis(): string | undefined { return this.nis; }

    public getRegistrationNumber(): string { return this.registrationNumber; }

    public getSocialPrograms(): SocialProgram | undefined { return this.socialPrograms; }

    public getEmploymentStatus(): EmploymentStatus | undefined { return this.employmentStatus; }

    public setFullName(fullName: string): void { this.fullName = fullName; }

    public setPhoneNumber(phoneNumber: string): void { this.phoneNumber = phoneNumber; }

    public setRelationship(relationship: string): void { this.relationship = relationship; }

    public setEmail(email: string): void { this.email = email; }

    public setSocialName(socialName: string): void { this.socialName = socialName; }

    public setRace(race: Race): void { this.race = race; }

    public setGender(gender: Gender): void { this.gender = gender; }

    public setEducationLevel(educationLevel: EducationLevel): void { this.educationLevel = educationLevel; }

    public setDateOfBirth(dateOfBirth: Date): void { this.dateOfBirth = dateOfBirth; }

    public setSocialPrograms(socialPrograms: SocialProgram): void { this.socialPrograms = socialPrograms; }

    public setEmploymentStatus(employmentStatus: EmploymentStatus): void { this.employmentStatus = employmentStatus; }

    public setNis(nis: string): void { this.nis = nis; }

    public setRegistrationNumber(registrationNumber: string): void { this.registrationNumber = registrationNumber; }

    public setAddressId(addressId: number | null | undefined): void { this.addressId = addressId; }
}

