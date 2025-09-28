interface StudentProps {
    fullName: string;
    registrationNumber: string;
    dateOfBirth?: Date;
    socialName?: string;
    id?: number;
    addressId?: number | null,
}

export class Student {
    id?: number;
    fullName: string;
    registrationNumber: string;
    dateOfBirth?: Date;
    socialName?: string;
    enrollmentDate: Date;
    status: string;
    addressId?: number | null

    constructor(props: StudentProps) {
        this.id = props.id;
        this.fullName = props.fullName;
        this.registrationNumber = props.registrationNumber;
        this.dateOfBirth = props.dateOfBirth;
        this.socialName = props.socialName;
        this.enrollmentDate = new Date();
        this.status = 'ATIVO';
        this.addressId = props.addressId;
    }

    getId(): number | undefined {
        return this.id;
    }

    getFullName(): string {
        return this.fullName;
    }

    getRegistrationNumber(): string {
        return this.registrationNumber;
    }

    getDateOfBirth(): Date | undefined {
        return this.dateOfBirth;
    }

    getSocialName(): string | undefined {
        return this.socialName;
    }

    getEnrollmentDate(): Date {
        return this.enrollmentDate;
    }

    getStatus(): string {
        return this.status;
    }

    public getAddressId(): number | null | undefined { 
        return this.addressId; 
    }

    setFullName(fullName: string): void {
        this.fullName = fullName;
    }

    setRegistrationNumber(registrationNumber: string): void {
        this.registrationNumber = registrationNumber;
    }

    setDateOfBirth(dateOfBirth: Date): void {
        this.dateOfBirth = dateOfBirth;
    }

    setSocialName(socialName: string): void {
        this.socialName = socialName;
    }

    setStatus(status: string): void {
        this.status = status;
    }

    public setAddressId(addressId: number | null | undefined): void { 
        this.addressId = addressId;
    }
}
