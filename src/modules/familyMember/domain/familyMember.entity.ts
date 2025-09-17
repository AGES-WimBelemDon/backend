import { Optional } from "@nestjs/common";
import { Race, Gender, EducationLevel, SocialProgram, EmploymentStatus, Address, Student } from "@prisma/client";

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
    students: [Student],
    address: Address
}

export class FamilyMemberEntity {
    private readonly id: number;
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
    private students: Student[];
    private address: Address;


    constructor(props: familyMemberProps) {
        this.id = props.id;
        this.students = props.students;
        this.address = props.address;
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

    public getStudents(): Student[] { return this.students; }

    public getAddress(): Address { return this.address; }

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

