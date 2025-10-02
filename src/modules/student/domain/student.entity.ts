import { EmploymentStatus, Gender, Race, SchoolYear, SocialProgram, StudentStatus } from "src/common/enums/domain.enums";

interface StudentProps {
    fullName: string;
    registrationNumber: string;
    id?: number;
    enrollmentDate?: Date;
    disenrollmentDate?: Date | null;
    status?: StudentStatus;
    dateOfBirth?: Date | null;
    socialName?: string | null;
    race?: Race | null;
    gender?: Gender | null;
    levelId?: number | null;
    schoolName?: string | null;
    schoolShift?: string | null;
    schoolYear?: SchoolYear | null;
    gradeGap?: boolean | null;
    socialPrograms?: SocialProgram | null;
    employmentStatus?: EmploymentStatus | null;
    addressId?: number | null;
}
export class Student {
    id?: number;
    fullName: string;
    registrationNumber: string;
    enrollmentDate: Date;
    disenrollmentDate?: Date | null;
    status: StudentStatus;
    dateOfBirth?: Date | null;
    socialName?: string | null;
    race?: Race | null;
    gender?: Gender | null;
    levelId?: number | null;
    schoolName?: string | null;
    schoolShift?: string | null;
    schoolYear?: SchoolYear | null;
    gradeGap?: boolean | null;
    socialPrograms?: SocialProgram | null;
    employmentStatus?: EmploymentStatus | null;
    addressId?: number | null;

    constructor(props: StudentProps) {
        this.id = props.id;
        this.fullName = props.fullName;
        this.registrationNumber = props.registrationNumber;
        this.enrollmentDate = props.enrollmentDate ?? new Date();
        this.status = props.status ?? StudentStatus.ATIVO;
        this.disenrollmentDate = props.disenrollmentDate;
        this.dateOfBirth = props.dateOfBirth;
        this.socialName = props.socialName;
        this.race = props.race;
        this.gender = props.gender;
        this.levelId = props.levelId;
        this.schoolName = props.schoolName;
        this.schoolShift = props.schoolShift;
        this.schoolYear = props.schoolYear;
        this.gradeGap = props.gradeGap;
        this.socialPrograms = props.socialPrograms;
        this.employmentStatus = props.employmentStatus;
        this.addressId = props.addressId;
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getFullName(): string {
        return this.fullName;
    }

    public getRegistrationNumber(): string {
        return this.registrationNumber;
    }

    public getEnrollmentDate(): Date {
        return this.enrollmentDate;
    }

    public getDisenrollmentDate(): Date | null | undefined {
        return this.disenrollmentDate;
    }

    public getStatus(): StudentStatus {
        return this.status;
    }

    public getDateOfBirth(): Date | null | undefined {
        return this.dateOfBirth;
    }

    public getSocialName(): string | null | undefined {
        return this.socialName;
    }

    public getRace(): Race | null | undefined {
        return this.race;
    }

    public getGender(): Gender | null | undefined {
        return this.gender;
    }

    public getLevelId(): number | null | undefined {
        return this.levelId;
    }

    public getSchoolName(): string | null | undefined {
        return this.schoolName;
    }

    public getSchoolShift(): string | null | undefined {
        return this.schoolShift;
    }

    public getSchoolYear(): SchoolYear | null | undefined {
        return this.schoolYear;
    }

    public getGradeGap(): boolean | null | undefined {
        return this.gradeGap;
    }

    public getSocialPrograms(): SocialProgram | null | undefined {
        return this.socialPrograms;
    }

    public getEmploymentStatus(): EmploymentStatus | null | undefined {
        return this.employmentStatus;
    }

    public getAddressId(): number | null | undefined {
        return this.addressId;
    }

    public setFullName(name: string): void {
        this.fullName = name;
    }

    public setRegistrationNumber(regNum: string): void {
        this.registrationNumber = regNum;
    }

    public setStatus(status: StudentStatus): void {
        this.status = status;
    }

    public setDisenrollmentDate(date: Date | null): void {
        this.disenrollmentDate = date;
    }

    public setDateOfBirth(date: Date | null): void {
        this.dateOfBirth = date;
    }

    public setSocialName(name: string | null): void {
        this.socialName = name;
    }

    public setRace(race: Race | null): void {
        this.race = race;
    }

    public setGender(gender: Gender | null): void {
        this.gender = gender;
    }

    public setLevelId(id: number | null): void {
        this.levelId = id;
    }

    public setSchoolName(name: string | null): void {
        this.schoolName = name;
    }

    public setSchoolShift(shift: string | null): void {
        this.schoolShift = shift;
    }

    public setSchoolYear(year: SchoolYear | null): void {
        this.schoolYear = year;
    }

    public setGradeGap(gap: boolean | null): void {
        this.gradeGap = gap;
    }

    public setSocialPrograms(program: SocialProgram | null): void {
        this.socialPrograms = program;
    }

    public setEmploymentStatus(status: EmploymentStatus | null): void {
        this.employmentStatus = status;
    }

    public setAddressId(addressId: number | null): void {
        this.addressId = addressId;
    }
};