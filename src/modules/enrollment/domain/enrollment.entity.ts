export interface EnrollmentProps {
  id: number | null;
  studentId: number;
  classId: number;
  enrollmentDate: Date;
  endDate: Date | null;
}

export class Enrollment {
  private readonly id: number | null;
  private readonly studentId: number;
  private readonly classId: number;
  private readonly enrollmentDate: Date;
  private endDate: Date | null;

  public constructor(props: EnrollmentProps) {
    if (!props.studentId || !props.classId) {
      throw new Error("Enrollment requires a studentId and a classId.");
    }

    this.id = props.id;
    this.studentId = props.studentId;
    this.classId = props.classId;
    this.enrollmentDate = props.enrollmentDate;
    this.endDate = props.endDate;
  }

  public getId(): number | null {
    return this.id;
  }

  public getStudentId(): number {
    return this.studentId;
  }

  public getClassId(): number {
    return this.classId;
  }

  public getEnrollmentDate(): Date {
    return this.enrollmentDate;
  }

  public getEndDate(): Date | null {
    return this.endDate;
  }

  public setEndDate(date: Date | null): void {
    this.endDate = date;
  }

  public isActive(): boolean {
    return this.endDate === null;
  }

  public deactivate(): void {
    this.endDate = new Date();
  }

  public reactivate(): void {
    this.endDate = null;
  }
}
